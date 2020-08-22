#!/usr/bin/python3
# -*- coding: utf-8 -*-

import sys
import html
import databases
import timeit
import orjson

from view.asagi import app, CONF, DEBUG

SELECTOR = """SELECT
    `num` AS `no`,
    (CASE WHEN 1=1 THEN 1 ELSE NULL END) AS `closed`,
    DATE_FORMAT(FROM_UNIXTIME(`timestamp`), "%m/%d/%y(%a)%H:%i:%S") AS `now`,
    `name`,
    `{board}`.`sticky`,
    (CASE WHEN `title` IS NULL THEN '' ELSE `title` END) AS `sub`,
    `media_w` AS `w`,
    `media_h` AS `h`,
    `preview_w` AS `tn_w`,
    `preview_h` AS `tn_h`,
    `timestamp` AS `time`,
    `preview_orig` AS `asagi_preview_filename`,
    `media_orig` AS `asagi_filename`,
    (CASE WHEN `media_orig` IS NULL THEN timestamp * 1000 ELSE SUBSTRING_INDEX(media_orig, '.', 1) END) AS `tim`,
    `{board}`.`media_hash` AS `md5`,
    `media_size` AS `fsize`,
    (CASE WHEN `media_filename` IS NULL THEN NULL ELSE SUBSTRING_INDEX(media_filename, '.', 1) END) AS `filename`,
    (CASE WHEN `media_filename` IS NULL THEN NULL ELSE CONCAT('.', SUBSTRING_INDEX(media_filename, '.', -1)) END) AS `ext`,
    (CASE WHEN op=1 THEN CAST(0 AS UNSIGNED) ELSE `{board}`.`thread_num` END) AS `resto`,
    (CASE WHEN capcode='N' THEN NULL ELSE `capcode` END) AS `capcode`,
    `trip`,
    `spoiler`,
    `poster_country` AS `country`,
    `{board}`.`locked` AS `closed`,
    `deleted` AS `filedeleted`,
    `exif`,
    `comment` AS `com` """
# (SELECT `media` FROM {board}_images WHERE {board}.media_hash={board}_images.media_hash) AS asagi_filename,
# (CASE WHEN (SELECT `preview_reply` FROM {board}_images WHERE {board}.media_hash={board}_images.media_hash) IS NULL THEN CONCAT(SUBSTRING_INDEX((SELECT `media` FROM {board}_images WHERE {board}.media_hash={board}_images.media_hash), '.', 1), 's.jpg') ELSE (SELECT `preview_reply` FROM {board}_images WHERE {board}.media_hash={board}_images.media_hash) END) AS asagi_preview_filename,

SELECT_POST = SELECTOR + "FROM `{board}` WHERE `num`={post_num}"
SELECT_POST_IMAGES = "SELECT `media_hash`,`media`,`preview_reply` FROM `{board}_images` WHERE `media_hash` IN (SELECT `media_hash` FROM `{board}` WHERE `num`={post_num})"
SELECT_THREAD = SELECTOR + "FROM `{board}` WHERE `thread_num`={thread_num} ORDER BY `num`"
SELECT_THREAD_IMAGES = "SELECT `media_hash`,`media`,`preview_reply` FROM `{board}_images` WHERE `media_hash` IN (SELECT `media_hash` FROM `{board}` WHERE `thread_num`={thread_num})"
SELECT_THREAD_DETAILS = "SELECT `nreplies`, `nimages` FROM `{board}_threads` WHERE `thread_num`={thread_num}"
SELECT_THREAD_OP = SELECTOR + "FROM `{board}` WHERE `thread_num`={thread_num} AND op=1"
SELECT_THREAD_OP_IMAGES = "SELECT `media_hash`,`media`,`preview_reply` FROM `{board}_images` WHERE `media_hash` IN (SELECT `media_hash` FROM `{board}` WHERE `thread_num`={thread_num} AND op=1)"
SELECT_THREAD_PREVIEW = SELECTOR + "FROM `{board}` WHERE `thread_num`={thread_num} ORDER BY `num` DESC LIMIT 5"
SELECT_THREAD_PREVIEW_IMAGES = "SELECT `media_hash`,`media`,`preview_reply` FROM `{board}_images` WHERE `media_hash` IN (SELECT `media_hash` FROM `{board}` WHERE `thread_num`={thread_num} ORDER BY `num`)"  # ERROR 1235 (42000): This version of MySQL doesn't yet support 'LIMIT & IN/ALL/ANY/SOME subquery'
SELECT_THREAD_LIST_BY_OFFSET = "SELECT `thread_num` FROM `{board}_threads` ORDER BY `time_last` DESC LIMIT 10 OFFSET {page_num}"
SELECT_GALLERY_THREADS_BY_OFFSET = SELECTOR + "FROM `{board}` INNER JOIN `{board}_threads` ON `{board}`.`thread_num` = `{board}_threads`.`thread_num` WHERE OP=1 ORDER BY `{board}_threads`.`time_last` DESC LIMIT 150 OFFSET {page_num};"
SELECT_GALLERY_THREAD_IMAGES = "SELECT `{board}`.media_hash, `{board}_images`.`media`, `{board}_images`.`preview_reply` FROM ((`{board}` INNER JOIN `{board}_threads` ON `{board}`.`thread_num` = `{board}_threads`.`thread_num`) INNER JOIN `{board}_images` ON `{board}_images`.`media_hash` = `{board}`.`media_hash`) WHERE OP=1 ORDER BY `{board}_threads`.`time_last` DESC LIMIT 150 OFFSET {page_num};"
SELECT_GALLERY_THREAD_DETAILS = "SELECT `nreplies`, `nimages` FROM `{board}_threads` ORDER BY `time_last` DESC LIMIT 150 OFFSET {page_num}"

DB_ENGINE = CONF.database["default"]
PGSQL_GET_THREAD=''
PGSQL_SELECTOR=''

# This is temporary
if DB_ENGINE == "postgresql":
    import re

    postfix = "_asagi" if CONF.scraper["default"] == "ena" else ""
    # assign multiple variables (tuple unpacking)
    queries = [
        SELECT_POST,
        SELECT_POST_IMAGES,
        SELECT_THREAD,
        SELECT_THREAD_IMAGES,
        SELECT_THREAD_DETAILS,
        SELECT_THREAD_OP,
        SELECT_THREAD_OP_IMAGES,
        SELECT_THREAD_PREVIEW,
        SELECT_THREAD_PREVIEW_IMAGES,
        SELECT_THREAD_LIST_BY_OFFSET,
        SELECT_GALLERY_THREADS_BY_OFFSET,
        SELECT_GALLERY_THREAD_IMAGES,
        SELECT_GALLERY_THREAD_DETAILS,
    ]
    (
        SELECT_POST,
        SELECT_POST_IMAGES,
        SELECT_THREAD,
        SELECT_THREAD_IMAGES,
        SELECT_THREAD_DETAILS,
        SELECT_THREAD_OP,
        SELECT_THREAD_OP_IMAGES,
        SELECT_THREAD_PREVIEW,
        SELECT_THREAD_PREVIEW_IMAGES,
        SELECT_THREAD_LIST_BY_OFFSET,
        SELECT_GALLERY_THREADS_BY_OFFSET,
        SELECT_GALLERY_THREAD_IMAGES,
        SELECT_GALLERY_THREAD_DETAILS,
    ) = (
        re.sub("op=1", "op=true", query, flags=re.IGNORECASE)
        .replace(
            """`{board}` """,
            """`{board}{postfix}` """.format(board="{board}", postfix=postfix),
        )
        .replace(
            "`{board}`.",
            "`{board}{postfix}`.".format(board="{board}", postfix=postfix),
        )
        .replace("SUBSTRING_INDEX", "SPLIT_PART")
        .replace(
            """DATE_FORMAT(FROM_UNIXTIME(`timestamp`), "%m/%d/%y(%a)%H:%i:%S")""",
            """to_char(to_timestamp("timestamp"), 'MM/DD/YY(Dy)HH24:MI:SS')""",
        )
        .replace("media_orig, '.', 1)", "media_orig, '.', 1)::bigint")
        .replace("-1)", "2)")
        .replace(" THEN CAST(0 AS UNSIGNED)", " THEN 0")
        .replace("`", '"')
        for query in queries
    )
    # CREATE VIEW a_4chan AS SELECT
    PGSQL_SELECTOR='''
                    "no" ,
                    "subnum" ,
                    "sticky"::int::smallint as "sticky" ,
                    "closed"::int::smallint as "closed" ,
                    to_char(to_timestamp("time"), 'MM/DD/YY(Dy)HH24:MI:SS') as "now",
                    "name" ,
                    "sub" ,
                    "com" ,
                    "filedeleted" ,
                    "spoiler"::int::smallint as "spoiler" ,
                    "custom_spoiler" ,
                    "filename" ,
                    "ext" ,
                    "w" ,
                    "h" ,
                    "tn_w" ,
                    "tn_h" ,
                    "tim" ,
                    "time" ,
                    encode("md5", 'base64') as "md5",
                    -- encode("sha256", 'hex') as "sha256" ,
                    -- encode("sha256t", 'hex') as "sha256t" ,
                    "fsize" ,
                    "m_img"::int::smallint as "m_img" ,
                    "resto" ,
                    "trip" ,
                    "id" ,
                    "capcode" ,
                    "country" ,
                    "troll_country" ,
                    "country_name" ,
                    (CASE WHEN resto=0 AND "archived_on" is not null THEN 1 END)::smallint as "archived" ,
                    "bumplimit"::int::smallint as "bumplimit" ,
                    "archived_on" ,
                    "deleted_on",
                    "imagelimit"::int::smallint as "imagelimit" ,
                    "semantic_url" ,
                    "replies" ,
                    "images" ,
                    "unique_ips" ,
                    "tag" ,
                    "since4pass" ,
                    "last_modified" ,
                    "extra"
    '''
    # from a
    PGSQL_GET_THREAD = '''
        select row_to_json(o2) as res
        from (
          select
            (
              select json_agg(json_strip_nulls(row_to_json(o1)))
              from (
                select _post.*, encode(media.sha256, 'hex') as sha256, encode(media.sha256t, 'hex') as sha256t FROM (
                    select
                      %s
                    from "posts"
                    where ("no"={no} or "resto"={no}) and "board"={board_id}
                    -- order by "no"
                    {limit}
                ) _post
                FULL JOIN media ON decode(_post.md5, 'base64') = media.md5
                WHERE _post.no is not null
                order by _post.no
                
              ) o1
            ) as posts
        ) o2;
        ''' % PGSQL_SELECTOR
global database
database = None
DATABASE_URL = "{engine}://{user}:{password}@{host}:{port}/{database}{charset}"
global boards
boards={}

# from fastapi.staticfiles import StaticFiles
# app.mount("/assets", StaticFiles(directory="foolfuuka/assets"), name="assets")


@app.on_event("startup")
async def startup():
    global database
    global boards
    charset = CONF.database[DB_ENGINE]["charset"]
    url = DATABASE_URL.format(
        engine=DB_ENGINE,
        host=CONF.database[DB_ENGINE]["host"],
        port=CONF.database[DB_ENGINE]["port"],
        user=CONF.database[DB_ENGINE]["user"],
        password=CONF.database[DB_ENGINE]["password"],
        database=CONF.database[DB_ENGINE]["db"],
        charset=f"?charset={charset}" if DB_ENGINE == 'mysql' else f"?client_encoding={charset}"
    )
    database = databases.Database(url)
    await database.connect()
    ls=await get_boards()
    for row in ls:
        boards[row['board']]=row['id']

async def get_boards():
    sql=f'''SELECT * from boards'''
    return await db_handler(sql, True)

@app.on_event("shutdown")
async def shutdown():
    if database:
        await database.disconnect()


async def db_handler(sql: str, fetchall: bool):
    try:
        if not DEBUG:
            return (
                (await database.fetch_all(query=sql))
                if fetchall
                else (await database.fetch_one(query=sql))
            )
        else:
            await database.fetch_one(query="select 1")
            start = timeit.default_timer()
            if fetchall:
                result = await database.fetch_all(query=sql)
                end = timeit.default_timer()
                print("Time waiting for query: ", end - start)
                return result
            else:
                result = await database.fetch_one(query=sql)
                end = timeit.default_timer()
                print("Time waiting for query: ", end - start)
                return result
    except Exception as e:
        print(f"Query failed!: {e}")
        return ""


async def get_post(board: str, post_num: int):
    sql = SELECT_POST.format(board=board, post_num=post_num)
    return await db_handler(sql, fetchall=False)


async def get_post_images(board: str, post_num: int):
    sql = SELECT_POST_IMAGES.format(board=board, post_num=post_num)
    return await db_handler(sql, fetchall=False)


async def get_thread(board: str, thread_num: int):
    sql = SELECT_THREAD.format(board=board, thread_num=thread_num)
    return await db_handler(sql, fetchall=True)


async def get_thread_images(board: str, thread_num: int):
    sql = SELECT_THREAD_IMAGES.format(board=board, thread_num=thread_num)
    return await db_handler(sql, fetchall=True)


async def get_thread_details(board: str, thread_num: int):
    sql = SELECT_THREAD_DETAILS.format(board=board, thread_num=thread_num)
    return await db_handler(sql, fetchall=False)


async def get_thread_op(board: str, thread_num: int):
    sql = SELECT_THREAD_OP.format(board=board, thread_num=thread_num)
    return await db_handler(sql, fetchall=False)


async def get_thread_op_images(board: str, thread_num: int):
    sql = SELECT_THREAD_OP_IMAGES.format(board=board, thread_num=thread_num)
    return await db_handler(sql, fetchall=False)


async def get_thread_preview(board: str, thread_num: int):
    sql = SELECT_THREAD_PREVIEW.format(board=board, thread_num=thread_num)
    return await db_handler(sql, fetchall=True)


async def get_thread_preview_images(board: str, thread_num: int):
    sql = SELECT_THREAD_PREVIEW_IMAGES.format(board=board, thread_num=thread_num)
    return await db_handler(sql, fetchall=True)


async def get_thread_list(board: str, page_num: int):
    sql = SELECT_THREAD_LIST_BY_OFFSET.format(board=board, page_num=page_num * 10)
    return await db_handler(sql, fetchall=True)


async def get_gallery_threads(board: str, page_num: int):
    sql = SELECT_GALLERY_THREADS_BY_OFFSET.format(board=board, page_num=page_num * 150)
    return await db_handler(sql, fetchall=True)


async def get_gallery_images(board: str, page_num: int):
    sql = SELECT_GALLERY_THREAD_IMAGES.format(board=board, page_num=page_num)
    return await db_handler(sql, fetchall=True)


async def get_gallery_details(board: str, page_num: int):
    sql = SELECT_GALLERY_THREAD_DETAILS.format(board=board, page_num=page_num)
    return await db_handler(sql, fetchall=True)


#
# Re-convert asagi stripped comment into clean html
# Also create a dictionary with keys containing the post.no, which maps to a
# tuple containing the posts it links to.
# Returns a String (the processed comment) and a list (list of quotelinks in
# the post).
#
def restore_comment(com: str, post_no: int):
    try:
        split_by_line = html.escape(com).split("\n")
    except AttributeError:
        if com is not None:
            raise ()
        return "", ""
    quotelink_list = []
    # greentext definition: a line that begins with a single ">" and ends with
    # a '\n'
    # redirect definition: a line that begins with a single ">>", has a thread
    # number afterward that exists in the current thread or another thread
    # (may be inline)
    # >> (show OP)
    # >>>/g/ (board redirect)
    # >>>/g/<post_num> (board post redirect)
    for i in range(len(split_by_line)):
        curr_line = split_by_line[i]
        if "&gt;" == curr_line[:4] and "&gt;" != curr_line[4:8]:
            split_by_line[i] = """<span class="quote">%s</span>""" % curr_line
        elif (
            "&gt;&gt;" in curr_line
        ):  # TODO: handle situations where text is in front or after the
            # redirect
            subsplit_by_space = curr_line.split(" ")
            for j in range(len(subsplit_by_space)):
                curr_word = subsplit_by_space[j]
                # handle >>(post-num)
                if curr_word[:8] == "&gt;&gt;" and curr_word[8:].isdigit():
                    quotelink_list.append(curr_word[8:])
                    subsplit_by_space[j] = (
                        """<a href="#p%s" class="quotelink">%s</a>"""
                        % (curr_word[8:], curr_word)
                    )
                # handle >>>/<board-name>/
                # elif(curr_word[:12] == "&gt;&gt;&gt;" and '/' in curr_word[14:]):
                # TODO: build functionality
                # print("board redirect not yet implemented!: " + curr_word, file=sys.stderr)
            split_by_line[i] = " ".join(subsplit_by_space)
        if "[spoiler]" in curr_line:
            split_by_line[i] = """<span class="spoiler">""".join(
                split_by_line[i].split("[spoiler]")
            )
            split_by_line[i] = "</span>".join(split_by_line[i].split("[/spoiler]"))
        elif "[/spoiler]" in curr_line:
            split_by_line[i] = "</span>".join(split_by_line[i].split("[/spoiler]"))
        # if "[code]" in curr_line:
        # if "[/code]" in curr_line:
        # split_by_line[i] = """<code>""".join(split_by_line[i].split("[code]"))
        # split_by_line[i] = """</code>""".join(split_by_line[i].split("[/code]"))
        # else:
        # split_by_line[i] = """<pre>""".join(split_by_line[i].split("[code]"))
        # elif "[/code]" in curr_line:
        # split_by_line[i] = """</pre>""".join(split_by_line[i].split("[/code]"))
        # if "[banned]" in curr_line:
        # split_by_line[i] = """<span class="banned">""".join(split_by_line[i].split("[banned]"))
        # split_by_line[i] = "</span>".join(split_by_line[i].split("[/banned]"))
    return quotelink_list, "</br>".join(split_by_line)
import json
async def generate_index2(board_name: str, page_num: int, before:int, after:int, limit:int=15, html=True):
    # https://medium.com/kkempin/postgresqls-lateral-join-bfd6bd0199df
    # https://stackoverflow.com/a/53087015
    # https://www.citusdata.com/blog/2016/03/30/five-ways-to-paginate/
    # https://kb.objectrocket.com/postgresql/python-pagination-of-postgres-940
    # todo: fix before
    # todo?
    # Over time instead of last_modified because we don't wann pick up changes if a post was delted or banned somewhere in the middle of a thread
    # That shouldnt bump the index/catalog

#     field='no'
#     q_before=f'"a_4chan"."{field}" > {before}' if before and before > 0 else ''
#     q_after=f'"a_4chan"."{field}" < {after}' if after and after > 0 else ''
#     q_before_and=f'AND "a_4chan"."{field}" > {before}' if before and before > 0 else ''
#     q_after_and=f'AND "a_4chan"."{field}" < {after}' if after and after > 0 else ''
#     q_prefix='WHERE' if q_before or q_after else ''
#     q_sql=f"{q_prefix} {q_before} {q_after}"
#     direction='asc' if q_before else 'desc'
#     direction_opp='desc' if q_before else 'asc'
#     before_after_value=''
#     if before:
#         before_after_value=f' > {before}'
#     elif after:
#         before_after_value=f' < {after}'
#     where_clause=f"where (CASE WHEN o5.replies=0 THEN o5.no ELSE (o5.last_replies->-1->>'no')::bigint END) {before_after_value}" if before_after_value else ''
#     sql0=f'''
# select json_build_object('threads', json_strip_nulls(json_agg(o5))) as "result" from (
# 	select * from
# 		(select {PGSQL_SELECTOR} from {board_name} where "resto" = 0 {q_before_and} {q_after_and} order by "last_modified" {direction} limit 15) o3
# 	LEFT JOIN LATERAL
# 		(SELECT json_agg(o2.*) as last_replies FROM
# 		(select no from {board_name} where "resto" = 0 {q_before_and} {q_after_and} order by "last_modified" {direction} limit 15) o1
# 		LEFT JOIN LATERAL
# 	 	(select * from (select {PGSQL_SELECTOR} from {board_name} where "resto"=o1.no order by "no" desc limit 5)x order by "no" asc) o2
# 	 	ON o2.resto is not null
# 	 	GROUP by "resto") o4
# 	ON ("last_replies" #>> '{{0,resto}}')::bigint = "no" order by "last_modified" desc
# ) o5
#     '''
#     sql=f'''
# select json_build_object('threads', json_strip_nulls(json_agg(o6))) as "result" from ( select * from
# (select distinct on (op1.no) op1.*, (case when op1.replies=0 then null else o4.last_replies end) as last_replies from
# (select * from "{board_name}_4chan" where resto=0 order by "{board_name}_4chan".no asc) op1
# inner join lateral
# (
# -- select o44.last_replies from (
# select json_agg(o3.*) as last_replies  from (select ((COALESCE(reply.*, op.*)).record::text::"{board_name}_4chan").* from
# (select * from "{board_name}_4chan" where resto=0 order by "{board_name}_4chan".no asc) op
# inner join lateral
# (select * from (select * from "{board_name}_4chan" where "{board_name}_4chan".resto=op.no order by "{board_name}_4chan".no desc limit 5)o2 order by o2.no asc) reply
# on true
# order by reply.resto)o3
# group by o3.resto
# -- )o44 order by (o44.last_replies->-1->>'no')::bigint desc
# )o4
# on op1.no = (o4.last_replies->0->>'resto')::bigint or op1.replies=0
# )o5
# {where_clause}
# order by (CASE WHEN o5.replies=0 THEN o5.no ELSE (o5.last_replies->-1->>'no')::bigint END) desc
# limit {limit}
# )o6
#     '''
    after_before_clause=''
    if after != 0 and after is not None:
        after_before_clause=f'where combined_last_no > {after}'
    elif before != 0 and before is not None:
        after_before_clause=f'where combined_last_no < {before}'

    ordering='desc'
    ordering_after=''
    if after != 0 and after is not None:
        ordering=''
        ordering_after='order by combined_last_no desc'

    after_start=''
    after_end=''
    if after != 0 and after is not None:
        after_start='select * from ('
        after_end=')o00 order by combined_last_no desc'
    board=boards[board_name]
    sql2=f'''
    select json_build_object('threads', json_strip_nulls(json_agg(jj.*))) as "result" from (
    select to_char(to_timestamp(thread."time"), 'MM/DD/YY(Dy)HH24:MI:SS') as "now", thread.*, last_replies from (
    select o1.no,o1.board, json_strip_nulls(json_agg(o2.* order by o2.no)) as last_replies from
    (
        SELECT _post.*, encode(media.sha256, 'hex') as sha256, encode(media.sha256t, 'hex') as sha256t FROM (
        {after_start}
        select * from (
        select op.*, coalesce(reply.last_no, op.no) as combined_last_no, coalesce(reply.last_time, op.time) as combined_last_time from
        (select * from (select board, resto, max(no) as last_no, max(time) as last_time, max(tim) as last_tim from posts group by resto,board having resto!=0)x)reply
        FULL JOIN
        (select board, resto, no, time,md5 from posts where resto=0)op
        on reply.board = op.board and reply.resto=op.no
        -- faster here
        -- where op.no < 124205675 and op.board=1
        where op.board={board}
        order by combined_last_no {ordering}
        )o0
        {after_before_clause}
        limit {limit}
        {after_end}
        )_post
        FULL JOIN media ON _post.md5 = media.md5
        WHERE _post.no is not null
    )o1
    LEFT JOIN LATERAL
    
     -- (SELECT oo22.*, media.sha256, media.sha256t FROM 
        (select to_char(to_timestamp("time"), 'MM/DD/YY(Dy)HH24:MI:SS') as "now", * from (select posts.*, encode(media.sha256, 'hex') as sha256, encode(media.sha256t, 'hex') as sha256t from posts full join media on posts.md5 = media.md5 WHERE posts.no is not null and (posts.no=o1.no or posts.resto=o1.no) and posts.resto!=0 and posts.board=o1.board order by no desc limit 5 )oo order by no)o2
       
       -- INNER JOIN media ON oo22.md5 = media.md5
    -- )o2
    on o1.no=o2.resto and o1.board=o2.board
    group by o1.no,o1.board
    ) thread_w_last_replies
    LEFT JOIN LATERAL
    (select posts.*, encode(media.sha256, 'hex') as sha256, encode(media.sha256t, 'hex') as sha256t from posts full join media on posts.md5 = media.md5 WHERE posts.resto=0 and posts.no is not null) thread
    on thread.no = thread_w_last_replies.no and thread.board = thread_w_last_replies.board
    -- where thread.board=1
    order by (CASE WHEN replies=0 THEN thread_w_last_replies.no else (last_replies->-1->>'no')::bigint end) desc
    -- limit 15;
    )jj;
    '''
    # print(sql0)
    # ("last_replies" #>> '{{0,resto}}')::bigint = "no" order by (last_replies->-1->>'no')::bigint desc
    res=await db_handler(sql2, fetchall=False)
    if res:
        jj=orjson.loads(res['result'])
        return jj
    else:
        return orjson.loads('{}')
#
# Generate a board index.
#
async def generate_index(board_name: str, page_num: int, html=True):
    page_num -= 1
    thread_list = await get_thread_list(board_name, page_num)

    # for each thread, get the first 5 posts and put them in 'threads'
    threads = []
    for i in range(len(thread_list)):
        thread_id = thread_list[i]["thread_num"]
        try:
            thread_op, op_quotelinks = await convert_thread_op(board_name, thread_id)
        except Exception as e:
            print("Thread", thread_id, f"is empty! Skipping it.: {e}", file=sys.stderr,)
            continue

        asagi_thread, quotelinks = await convert_thread_preview(board_name, thread_id)
        details = await get_thread_details(board_name, thread_id)

        combined = {}

        # determine number of omitted posts
        omitted_posts = (
            details["nreplies"] - len(asagi_thread["posts"]) - 1
        )  # subtract OP
        thread_op["posts"][0]["omitted_posts"] = omitted_posts

        # determine number of omitted images
        num_images_shown = 0
        for i in range(len(asagi_thread["posts"])):
            post = asagi_thread["posts"][i]
            if post["md5"] and post["resto"] != 0:
                num_images_shown += 1
            # add quotelinks to thread
            if html:
                asagi_thread["posts"][i]["quotelinks"] = quotelinks

        omitted_images = details["nimages"] - num_images_shown
        if thread_op["posts"][0]["md5"]:
            omitted_images -= 1  # subtract OP if OP has image

        thread_op["posts"][0]["omitted_images"] = omitted_images

        # if the thread has only one post, don't repeat OP post.
        if thread_op["posts"] == asagi_thread["posts"]:
            combined = thread_op
        else:
            combined["posts"] = thread_op["posts"] + asagi_thread["posts"]

        threads.append(combined)

    # encapsulate threads around a dict
    result = {}
    result["threads"] = threads

    return result


#
# Generate gallery structure
#
async def generate_gallery(board_name: str, page_num: int):
    page_num -= 1  # start page number at 1
    thread_list = await get_gallery_threads(board_name, page_num)
    details = await get_gallery_details(board_name, page_num)

    gallery_list = convert(thread_list, details, isGallery=True)

    result = []
    page_threads = {"page": 0, "threads": []}
    for i in range(len(thread_list)):
        # new page every 15 threads
        if i % 15 == 0 and i != 0:
            result.append(page_threads)
            page_threads = {"page": (i // 14) + 1, "threads": []}
        page_threads["threads"].append(gallery_list[i])
    # add the last page threads
    result.append(page_threads)
    return result


#
# Generate a single post
#
async def convert_post(board_name: str, post_id: int):
    post = [await get_post(board_name, post_id)]
    images = [await get_post_images(board_name, post_id)]
    return convert(post, images=images, isPost=True)


#
# Generate the OP post
#
async def convert_thread_op(board_name: str, thread_id: int):
    op_post = [await get_thread_op(board_name, thread_id)]
    images = [await get_thread_op_images(board_name, thread_id)]
    details = [
        await get_thread_details(board_name, thread_id)
    ]  # details needs to be an array
    return convert(op_post, details, images)


#
# Generate a thread preview, removing OP post
#
async def convert_thread_preview(board_name: str, thread_id: int):
    thread = await get_thread_preview(board_name, thread_id)
    images = await get_thread_preview_images(board_name, thread_id)
    for i in range(len(thread)):
        if thread[i]["resto"] == 0:
            del thread[i]

    thread.reverse()
    return convert(thread, images=images)


#
# Convert threads to 4chan api
#
async def convert_thread2(board_name: str, thread_id: int, limit: int):
    limit_q = f'limit {limit}' if limit is not None and limit > 0 else ''
    j=(await db_handler(PGSQL_GET_THREAD.format(board_id=boards[board_name], no=thread_id, limit=limit_q), fetchall=False))
    return orjson.loads(j['res'])

async def convert_thread(board_name: str, thread_id: int):
    thread = await get_thread(board_name, thread_id)
    images = await get_thread_images(board_name, thread_id)
    details = [
        await get_thread_details(board_name, thread_id)
    ]  # details needs to be an array
    return convert(thread, details, images)


#
# Converts asagi API data to 4chan API format.
#
def convert(thread, details=None, images=None, isPost=False, isGallery=False):
    result = {}
    quotelink_map = {}
    posts = []
    for i in range(len(thread)):
        if not thread or not thread[i]: continue

        # The record object doesn't support assignment so we convert it to a
        # normal dict
        posts.append(dict(thread[i]))

        # TODO: asagi records time using an incorrect timezone configuration
        # which will need to be corrected
        if images and len(images) > 0:
            # find dict where media_hash is equal
            try:
                for media in filter(
                    lambda image: (image["media_hash"] == posts[i]["md5"])
                    if image
                    else False,
                    images,
                ):
                    if media["preview_reply"] is None and media["media"]:
                        posts[i]["asagi_preview_filename"] = (
                            media["media"].split(".")[0] + "s.jpg"
                        )
                    posts[i]["asagi_preview_filename"] = media["preview_reply"]
                    posts[i]["asagi_filename"] = media["media"]
            except Exception as e:
                print(f"ERROR convert: {e}")

        # else:
        # posts[i]['asagi_preview_filename'] = posts[i]['preview_orig']
        # posts[i]['asagi_filename'] = posts[i]['media_orig']

        # leaving semantic_url empty for now
        if details and posts[i]["resto"] == 0:
            posts[i]["replies"] = details[i]["nreplies"]
            posts[i]["images"] = details[i]["nimages"]

        # generate comment content
        if not isGallery:
            post_quotelinks, posts[i]["com"] = restore_comment(
                posts[i]["com"], posts[i]["no"]
            )
            for quotelink in post_quotelinks:  # for each quotelink in the post,
                if quotelink not in quotelink_map:
                    quotelink_map[quotelink] = []
                quotelink_map[quotelink].append(
                    posts[i]["no"]
                )  # add the current post.no to the quotelink's post.no key

    if isPost:
        return posts[0] if len(posts) > 0 else posts

    if isGallery:
        return posts

    # print(quotelink_map, file=sys.stderr)
    result["posts"] = posts
    return result, quotelink_map
