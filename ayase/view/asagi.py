#!/usr/bin/python3
# -*- coding: utf-8 -*-

import config as CONF
import subprocess
import timeit

from fastapi import FastAPI, Request, Response, status
from fastapi.openapi.utils import get_openapi
from fastapi.responses import HTMLResponse, ORJSONResponse
from fastapi.staticfiles import StaticFiles
from jinja2 import (
    Environment,
    FileSystemLoader,
    select_autoescape,
    # PackageLoader
)

app = FastAPI()

app.mount("/assets", StaticFiles(directory="foolfuuka/assets"), name="assets")
# app.mount("/img", StaticFiles(directory="/home/mizu/source/github/ena-dev/assets/media/thumbnails"), name="img-thumbs")
# app.mount("/img", StaticFiles(directory="/home/mizu/source/github/ena-dev/assets/media/full"), name="img-full")
DEBUG = CONF.DEBUG

# This has to be here so the above is loaded prior to importing these
from model.ayase import (convert_thread, generate_index, convert_post,
                         generate_gallery, generate_index2, convert_thread2)

env = Environment(
    # loader=PackageLoader('ayase', 'templates'),
    loader=FileSystemLoader("foolfuuka/templates"),
    autoescape=select_autoescape(["html", "xml"]))

# Custom filter method
def color(id, add):
    return (sum([ord(ch) for ch in id]) + add) % 255
env.filters['color'] = color

archives = CONF.archives
archive_list = []

boards = CONF.boards
skins = CONF.skins
site_name = CONF.SITE_NAME
scraper = CONF.scraper
board_list = []

image_uri = CONF.image_location["image"]
thumb_uri = CONF.image_location["thumb"]

if boards:
    for i in boards:
        board_list.append(i["shortname"])

if archives:
    for i in archives:
        archive_list.append(i["shortname"])

# Caches templates
template_index = env.get_template("index.html")
template_board_index = env.get_template("board_index.html")
template_404 = env.get_template("404.html")
template_gallery = env.get_template("gallery.html")
template_thread = env.get_template("thread.html")
template_post = env.get_template("post.html")
template_posts = env.get_template("posts.html")
TEMPLATE_4CHAN_INDEX = env.get_template("4chan_index.html")
TEMPLATE_4CHAN_THREAD = env.get_template("4chan_thread.html")
TEMPLATE_4CHAN_CATALOG = env.get_template("4chan_catalog.html")


def custom_openapi(openapi_prefix: str):
    if app.openapi_schema:
        return app.openapi_schema
    revision = "0.1.0"
    try:
        revision = (subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"], stdout=subprocess.PIPE)
                    .stdout.decode("utf-8").rstrip())
    except Exception:
        pass
    openapi_schema = get_openapi(
        title="Ayase",
        version=revision,
        description="The Ayase Imageboard Archival Standard",
        routes=app.routes,
        openapi_prefix=openapi_prefix,
    )
    openapi_schema["info"]["x-logo"] = {
        "url":
        "https://c4.wallpaperflare.com/wallpaper/530/77/135/anime-yotsuba-fuuka-ayase-mr-koiwai-yotsuba-wallpaper-preview.jpg"
        # "url": "https://c4.wallpaperflare.com/wallpaper/487/5/317/anime-yotsuba-fuuka-ayase-wallpaper-preview.jpg"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


class NotFoundException(Exception):

    def __init__(self, board_name=site_name):
        self.title_window = board_name
        if board_name == site_name:
            return
        if not (board_name in archive_list or board_name in board_list):
            self.title_window = site_name
            return
        board_description = get_board_entry(board_name)["name"]
        title = (f"/{board_name}/ - {board_description}"
                 if board_description else board_name)
        self.title_window = title


@app.exception_handler(NotFoundException)
async def not_found_exception_handler(request: Request, exc: NotFoundException):
    content = template_404.render(
        title=exc.title_window,
        title_window=exc.title_window,
        archives=archives,
        boards=boards,
        skin=get_skin(request),
        skins=skins,
        site_name=site_name,
        options=CONF.options,
        status_code=404,
        scraper=scraper,
    )
    return HTMLResponse(content=content, status_code=404)


def get_skin(request: Request):
    try:
        skin4ch_cookie = request.cookies.get("ws_style")
        skin_cookie = request.cookies.get("ws_style")
        return skin_cookie if skin_cookie else CONF.default_skin
    except:
        return CONF.default_skin


# Find board in list of archives, if not check list of boards, otherwise
# return empty entry
def get_board_entry(board_name: str):
    return next(
        (item for item in archives if item["shortname"] == board_name),
        next(
            (item for item in boards if item["shortname"] == board_name),
            {"shortname": "",
             "name": ""},
        ),
    )


# Order matters
# https://fastapi.tiangolo.com/tutorial/path-params/#order-matters
@app.get("/", response_class=HTMLResponse)
async def index_html(request: Request, response: Response):
    # response.set_cookie(key="ws_style", value="Tomorrow")
    content = template_index.render(
        title=site_name,
        title_window=site_name,
        archives=archives,
        boards=boards,
        skin=get_skin(request),
        skins=skins,
        site_name=site_name,
        options=CONF.options,
        scraper=scraper,
    )
    return content


# https://stackoverflow.com/a/50472882
@app.get("/{board_name}", response_class=HTMLResponse)
async def board_html(request: Request,
                     board_name: str,
                     before: int = None,
                     after: int = None,
                     limit: int = 15):
    if board_name in archive_list or board_name in board_list:
        start = timeit.default_timer()
        index = await generate_index2(board_name, 1, before, after, limit)
        if index and index.get('threads') and len(index["threads"]) > 0:
            board_description = get_board_entry(board_name)["name"]
            title = f"/{board_name}/ - {board_description}"
            # print(index['threads'][0]['quotelinks'])
            content = TEMPLATE_4CHAN_INDEX.render(
                asagi=False,
                fromIndex=True,
                page_num=1,
                threads=index["threads"],
                after=after,
                before=before,
                quotelinks=[],
                archives=archives,
                board=board_name,
                boards=boards,
                image_uri=image_uri.format(board_name=board_name),
                thumb_uri=thumb_uri.format(board_name=board_name),
                options=CONF.options,
                title=title,
                title_window=title,
                skin=get_skin(request),
                skins=skins,
                site_name=site_name,
                scraper=scraper,
            )
            end = timeit.default_timer()
            if DEBUG:
                print("Time to generate index: ", end - start)
            return content
    raise NotFoundException(board_name)


@app.get("/{board_name}/catalog.json")
async def gallery(board_name: str, response: Response):
    if board_name in archive_list or board_name in board_list:
        return await generate_gallery(board_name, 1)
    response.status_code = status.HTTP_404_NOT_FOUND
    return {"error": 404}


@app.get("/{board_name}/catalog", response_class=HTMLResponse)
async def catalog_html(request: Request,
                       board_name: str,
                       before: int = None,
                       after: int = None,
                       limit: int = 15):
    if board_name in archive_list or board_name in board_list:
        start = timeit.default_timer()
        index = await generate_index2(board_name, 1, before, after, limit=150)
        if index and index.get('threads') and len(index["threads"]) > 0:
            board_description = get_board_entry(board_name)["name"]
            title = f"/{board_name}/ - {board_description}"
            # print(index['threads'][0]['quotelinks'])
            content = TEMPLATE_4CHAN_CATALOG.render(
                asagi=True,
                page_num=1,
                threads=index["threads"],
                after=after,
                before=before,
                quotelinks=[],
                archives=archives,
                board=board_name,
                boards=boards,
                image_uri=image_uri.format(board_name=board_name),
                thumb_uri=thumb_uri.format(board_name=board_name),
                options=CONF.options,
                title=title,
                title_window=title,
                skin=get_skin(request),
                skins=skins,
                site_name=site_name,
                scraper=scraper,
            )
            end = timeit.default_timer()
            if DEBUG:
                print("Time to generate index: ", end - start)
            return content
    raise NotFoundException(board_name)


@app.get("/{board_name}/gallery", response_class=HTMLResponse)
async def gallery_html(request: Request, board_name: str):
    if board_name in archive_list or board_name in board_list:
        start = timeit.default_timer()
        gallery = await generate_gallery(board_name, 1)

        board_description = get_board_entry(board_name)["name"]
        title = f"/{board_name}/ - {board_description}"
        title_window = title + " » Gallery"
        content = template_gallery.render(
            asagi=True,
            gallery=gallery,
            page_num=1,
            archives=archives,
            board=board_name,
            boards=boards,
            image_uri=image_uri.format(board_name=board_name),
            thumb_uri=thumb_uri.format(board_name=board_name),
            title=title,
            title_window=title_window,
            options=CONF.options,
            skin=get_skin(request),
            skins=skins,
            scraper=scraper,
        )
        end = timeit.default_timer()
        if DEBUG:
            print("Time to generate gallery: ", end - start)
        return content
    raise NotFoundException(board_name)


@app.get("/{board_name}/gallery/{page_num}", response_class=HTMLResponse)
async def gallery_index_html(request: Request, board_name: str, page_num: int):
    if board_name in archive_list or board_name in board_list:
        start = timeit.default_timer()
        gallery = await generate_gallery(board_name, page_num)
        board_description = get_board_entry(board_name)["name"]
        title = f"/{board_name}/ - {board_description}"
        title_window = title + f" » Gallery Page {page_num}"
        content = template_gallery.render(
            asagi=True,
            gallery=gallery,
            page_num=page_num,
            archives=archives,
            board=board_name,
            boards=boards,
            image_uri=image_uri.format(board_name=board_name),
            thumb_uri=thumb_uri.format(board_name=board_name),
            title=title,
            title_window=title_window,
            options=CONF.options,
            skin=get_skin(request),
            skins=skins,
            scraper=scraper,
        )
        end = timeit.default_timer()
        if DEBUG:
            print("Time to generate gallery: ", end - start)
        return content
    raise NotFoundException(board_name)


@app.get("/{board_name}/page/{page_num}", response_class=HTMLResponse)
async def board_index_html(request: Request, board_name: str, page_num: int):
    if board_name in archive_list or board_name in board_list:
        index = await generate_index(board_name, page_num)
        if len(index["threads"]) > 0:
            board_description = get_board_entry(board_name)["name"]
            title = f"/{board_name}/ - {board_description}"
            title_window = title + f" » Page {page_num}"
            content = template_board_index.render(
                asagi=True,
                page_num=page_num,
                threads=index["threads"],
                quotelinks=[],
                archives=archives,
                board=board_name,
                boards=boards,
                image_uri=image_uri.format(board_name=board_name),
                thumb_uri=thumb_uri.format(board_name=board_name),
                options=CONF.options,
                title=title,
                title_window=title_window,
                skin=get_skin(request),
                skins=skins,
                site_name=site_name,
                scraper=scraper,
            )
            return content
    raise NotFoundException(board_name)


@app.get("/{board_name}/thread/{thread_id}.json", response_class=ORJSONResponse)
async def thread(board_name: str,
                 thread_id: int,
                 response: Response,
                 limit: int = None):
    if board_name in archive_list or board_name in board_list:
        res = await convert_thread2(board_name, thread_id, limit)
        # if res and len(res) > 0 and res[0].get("posts"):
        if res:
            return res
    response.status_code = status.HTTP_404_NOT_FOUND
    return {"error": 404}


@app.get("/{board_name}/thread/{thread_id}", response_class=HTMLResponse)
async def thread_html(request: Request, board_name: str, thread_id: int):
    if board_name in archive_list or board_name in board_list:
        start = timeit.default_timer()

        # use the existing json app function to grab the data
        # thread_dict, quotelinks = await convert_thread(board_name, thread_id)
        thread = await convert_thread2(board_name, thread_id, limit=None)

        title = f"/{board_name}/"
        try:
            # title comes from op's subject, use post id instead if not found
            subject_title = thread["posts"][0].get("sub")
            board_description = get_board_entry(board_name)["name"]
            title = f"/{board_name}/ - {board_description}"
            title_window = (title + (f" - {subject_title}"
                                     if subject_title else "") +
                            f" » Thread #{thread_id} - {site_name}")
        except:
            # no thread was returned
            raise NotFoundException(board_name)

        content = TEMPLATE_4CHAN_THREAD.render(
            asagi=False,
            fromIndex=False,
            thread=thread,
            archives=archives,
            board=board_name,
            boards=boards,
            image_uri=image_uri.format(board_name=board_name),
            thumb_uri=thumb_uri.format(board_name=board_name),
            title=title,
            title_window=title_window,
            skin=get_skin(request),
            skins=skins,
            site_name=site_name,
            options=CONF.options,
            scraper=scraper,
        )
        end = timeit.default_timer()
        if DEBUG:
            print("Time to generate thread: ", end - start)
        return content
    raise NotFoundException(board_name)


# What is this endpoint for?
@app.get("/{board_name}/posts/{thread_id}", response_class=HTMLResponse)
async def posts_html(request: Request, board_name: str, thread_id: int):
    if board_name in archive_list or board_name in board_list:
        start = timeit.default_timer()
        thread_dict, quotelinks = await convert_thread(board_name, thread_id)

        if len(thread_dict["posts"]) > 0:
            # remove OP post
            del thread_dict["posts"][0]

            content = template_posts.render(
                asagi=True,
                posts=thread_dict["posts"],
                quotelinks=quotelinks,
                board=board_name,
                image_uri=image_uri.format(board_name=board_name),
                thumb_uri=thumb_uri.format(board_name=board_name),
                skin=get_skin(request),
                skins=skins,
                site_name=site_name,
                scraper=scraper,
            )
            end = timeit.default_timer()
            if DEBUG:
                print("Time to generate posts: ", end - start)
            return content
    raise NotFoundException(board_name)


@app.get("/{board_name}/post/{post_id}", response_class=HTMLResponse)
async def post_html(request: Request, board_name: str, post_id: int,
                    response: Response):
    if board_name in archive_list or board_name in board_list:

        post = await convert_post(board_name, post_id)

        if len(post) > 0:
            if post["resto"] == 0:
                post["resto"] = -1
            content = template_post.render(
                asagi=True,
                post=post,
                board=board_name,
                image_uri=image_uri.format(board_name=board_name),
                thumb_uri=thumb_uri.format(board_name=board_name),
                skin=get_skin(request),
                quotelink=True,
                scraper=scraper,
            )
            return content
    raise NotFoundException(board_name)


@app.get("/{board_name}/{page_num}.json", response_class=ORJSONResponse)
async def board_index(board_name: str,
                      page_num: int,
                      response: Response,
                      before: int = None,
                      after: int = None,
                      limit: int = 15):
    if board_name in archive_list or board_name in board_list:
        res = await generate_index2(
            board_name, page_num, before, after, limit, html=False)
        if res:  #and res.get('threads'):
            return res
    response.status_code = status.HTTP_404_NOT_FOUND
    return {"error": 404}
