var _adg = 1;
var jsVersion = 1046;
var comlen = 2000;
var maxFilesize = 4194304;
var cooldowns = {
    "thread": 600,
    "reply": 60,
    "image": 60
};
var catalog = {
    "threads": {
        "204715899": {
            "date": 1592637303,
            "file": "seems like &#039;somebody&#039; couldnt take a joke and wanted them gone.png",
            "r": 8,
            "i": 2,
            "lr": {
                "id": 204716795,
                "date": 1592640055,
                "author": "Anonymous"
            },
            "b": 0,
            "author": "Anonymous",
            "imgurl": "1592637303211",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Boku no Hero Academia",
            "teaser": "New episode out: https:\/\/files.catbox.moe\/rqgkc7.webm <s>No chapter this week due to author break. Next week&#039;s chapter should be early due to the whole of Jump releasing earlier.<\/s> What do you think of La Brava specifically? Did you find her to be a believable or relatable character?"
        },
        "204687736": {
            "date": 1592589219,
            "file": "[HorribleSubs] Nami yo Kiitekure - 11 [720p]_00_20_41_13.jpg",
            "r": 198,
            "i": 75,
            "lr": {
                "id": 204716794,
                "date": 1592640055,
                "author": "Anonymous"
            },
            "b": 1,
            "author": "Anonymous",
            "imgurl": "1592589219483",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Nami yo Kiitekure",
            "teaser": "Final episode today. It&#039;s been a pleasure watching this with you all."
        },
        "204714522": {
            "date": 1592633615,
            "file": "Dragon Ball Super.gif",
            "r": 159,
            "i": 64,
            "lr": {
                "id": 204716793,
                "date": 1592640054,
                "author": "Anonymous"
            },
            "b": 2,
            "author": "Anonymous",
            "imgurl": "1592633615689",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Dragon Ball Super",
            "teaser": "How come so many people praise the Dragon Ball Super anime on here? Do you believe it&#039;ll get another season?"
        },
        "204713110": {
            "date": 1592630203,
            "file": "78EB987B-C40F-4A19-8BE5-F3E622492F9B.jpg",
            "r": 200,
            "i": 64,
            "lr": {
                "id": 204716792,
                "date": 1592640052,
                "author": "Anonymous"
            },
            "b": 3,
            "author": "Anonymous",
            "imgurl": "1592630203216",
            "tn_w": 250,
            "tn_h": 165,
            "sub": "Kaguya manga thread",
            "teaser": "The real endgame. Ishigami will mend her broken heart."
        },
        "204699016": {
            "date": 1592606366,
            "file": "youll-have-more-fun-with-the-others-but-i-was-56791714.png",
            "r": 210,
            "i": 75,
            "lr": {
                "id": 204716791,
                "date": 1592640051,
                "author": "Anonymous"
            },
            "b": 4,
            "author": "Anonymous",
            "imgurl": "1592606366869",
            "tn_w": 199,
            "tn_h": 250,
            "sub": "",
            "teaser": "post relatable quotes"
        },
        "204708897": {
            "date": 1592622251,
            "file": "1E331391-3540-4283-B107-9A64F8F6B7A3.jpg",
            "r": 205,
            "i": 47,
            "lr": {
                "id": 204716789,
                "date": 1592640045,
                "author": "Anonymous"
            },
            "b": 5,
            "author": "Anonymous",
            "imgurl": "1592622251046",
            "tn_w": 250,
            "tn_h": 187,
            "sub": "Chainsaw Man",
            "teaser": "So she\u2019s still best girl, right?"
        },
        "204708328": {
            "date": 1592621256,
            "file": "1592607249894.jpg",
            "r": 55,
            "i": 11,
            "lr": {
                "id": 204716790,
                "date": 1592640045,
                "author": "Anonymous"
            },
            "b": 6,
            "author": "Anonymous",
            "imgurl": "1592621256707",
            "tn_w": 140,
            "tn_h": 250,
            "sub": "",
            "teaser": "Why does she even love Okabe? He treated her pretty badly throughout most of the show."
        },
        "204699343": {
            "date": 1592606867,
            "file": "1525658.jpg",
            "r": 355,
            "i": 91,
            "lr": {
                "id": 204716788,
                "date": 1592640037,
                "author": "Anonymous"
            },
            "b": 7,
            "author": "Anonymous",
            "imgurl": "1592606867994",
            "tn_w": 174,
            "tn_h": 250,
            "sub": "",
            "teaser": "Was their relationship well done?"
        },
        "204712617": {
            "date": 1592629126,
            "file": "drake.jpg",
            "r": 262,
            "i": 97,
            "lr": {
                "id": 204716787,
                "date": 1592640036,
                "author": "Anonymous"
            },
            "b": 8,
            "author": "Anonymous",
            "imgurl": "1592629126870",
            "tn_w": 249,
            "tn_h": 154,
            "sub": "One piece",
            "teaser": "&gt;Now listen Page, I don&#039;t want to see you going over to Black Maria&#039;s district. I don&#039;t care if your sister is dragging you along, you don&#039;t need to know about the sort of stuff they do over there. &gt;Ignore Queen whenever he offers to take you one of the brothels in the capital too, let&#039;s just say &#039;the Plague&#039; isn&#039;t a title he got just from making bioweapons &gt;He has or has had almost every STD in the medical books and look at the fat fuck now. &gt;I know you&#039;re getting to an age where you&#039;re going to be thinking about... girls... in that way, but you should learn about safe sex first. Otherwise you could wind up confused like your sister. &gt;Like literally confused im not sure she understands what sex is. &gt;You can talk to me or Jack anytime you feel like you can&#039;t open up to anyone about this sort of stuff, alright?"
        },
        "204714139": {
            "date": 1592632610,
            "file": "Assassination Classroom - c134 (v16) - p000 [Digital-HD] [danke-Empire].jpg",
            "r": 201,
            "i": 188,
            "lr": {
                "id": 204716786,
                "date": 1592640037,
                "author": "Anonymous"
            },
            "b": 9,
            "trip": "!I46H95akI2",
            "author": "Magister",
            "imgurl": "1592632610924",
            "tn_w": 166,
            "tn_h": 250,
            "sub": "Assassination Classroom Vol 16 Storytime",
            "teaser": "Class is now in session. OP4 &gt;&gt;&gt;\/wsg\/3517884  We&#039;re on the good OP now &gt;What is AssClass? A powerful creature claims that within a year, Earth will be destroyed by him, but he offers mankind a chance by becoming a homeroom teacher where he teaches his students about how to kill him. The entire curriculum is available here: https:\/\/nyaa.si\/view\/1031205 To review: 3-E crushed the finals. List of assignments: Vol 8 &gt;&gt;204256868  Vol 9 &gt;&gt;204299523  Vol 10 &gt;&gt;204344362  Vol 11 &gt;&gt;204389368  Vol 12 &gt;&gt;204480915  Vol 13 &gt;&gt;204528294  Vol 14 &gt;&gt;204570550  Vol 15 &gt;&gt;204616235 https:\/\/desuarchive.org\/a\/search\/subject\/assassination%20classroom\/"
        },
        "204709834": {
            "date": 1592623981,
            "file": "images - 2020-06-10T004643.291.jpg",
            "r": 37,
            "i": 13,
            "lr": {
                "id": 204716785,
                "date": 1592640035,
                "author": "Anonymous"
            },
            "b": 10,
            "author": "Anonymous",
            "imgurl": "1592623981643",
            "tn_w": 250,
            "tn_h": 237,
            "sub": "",
            "teaser": "If japan didnt want people to be sexually attracted to lolis why did they make them so sexy? Its only natural to be attracted to them."
        },
        "204714658": {
            "date": 1592633951,
            "file": "1592623519956.jpg",
            "r": 16,
            "i": 3,
            "lr": {
                "id": 204716784,
                "date": 1592640032,
                "author": "Anonymous"
            },
            "b": 11,
            "author": "Anonymous",
            "imgurl": "1592633951622",
            "tn_w": 183,
            "tn_h": 250,
            "sub": "Buyfag thread",
            "teaser": "bote"
        },
        "204637023": {
            "date": 1592499053,
            "file": "fashionable kasumi.png",
            "r": 245,
            "i": 115,
            "lr": {
                "id": 204716783,
                "date": 1592640029,
                "author": "Anonymous"
            },
            "b": 12,
            "author": "Anonymous",
            "imgurl": "1592499053264",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Love Live",
            "teaser": "Is Kasumi the cutest Love Live?"
        },
        "204670427": {
            "date": 1592555352,
            "file": "hqdefault.jpg",
            "r": 385,
            "i": 93,
            "lr": {
                "id": 204716782,
                "date": 1592640029,
                "author": "Anonymous"
            },
            "b": 13,
            "author": "Anonymous",
            "imgurl": "1592555352163",
            "tn_w": 250,
            "tn_h": 187,
            "sub": "",
            "teaser": "Anime that was Popular everywhere but America."
        },
        "204674981": {
            "date": 1592565813,
            "file": "1.jpg",
            "r": 265,
            "i": 46,
            "lr": {
                "id": 204716779,
                "date": 1592640018,
                "author": "Anonymous"
            },
            "b": 14,
            "author": "Anonymous",
            "imgurl": "1592565813155",
            "tn_w": 173,
            "tn_h": 250,
            "sub": "Ayakashi Triangle",
            "teaser": "Korean Scans https:\/\/manamoa.net\/bbs\/board.php?bo_table=manga&amp;wr_id=3448489"
        },
        "204704250": {
            "date": 1592613966,
            "file": "1578176241320.png",
            "r": 396,
            "i": 105,
            "lr": {
                "id": 204716777,
                "date": 1592640007,
                "author": "Anonymous"
            },
            "b": 15,
            "author": "Anonymous",
            "imgurl": "1592613966553",
            "tn_w": 166,
            "tn_h": 250,
            "sub": "Shingeki no Kyojin",
            "teaser": "&gt;123  Mikasa chapter &gt;124  Gabi chapter &gt;125 Annie chapter &gt;126  Armin chapter &gt;127  Jean chapter  &gt;128  Connie chapter &gt;129 Magath chapter Who\u2019s next for 130?"
        },
        "204716464": {
            "date": 1592639037,
            "file": "1578843046432.jpg",
            "r": 15,
            "i": 6,
            "lr": {
                "id": 204716776,
                "date": 1592640006,
                "author": "Anonymous"
            },
            "b": 16,
            "author": "Anonymous",
            "imgurl": "1592639037196",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "NIGGER"
        },
        "204715825": {
            "date": 1592637092,
            "file": "EB81E603-C4E5-4A5B-ACD9-A11D4CD81364.jpg",
            "r": 20,
            "i": 15,
            "lr": {
                "id": 204716775,
                "date": 1592640003,
                "author": "Anonymous"
            },
            "b": 17,
            "author": "Anonymous",
            "imgurl": "1592637092144",
            "tn_w": 250,
            "tn_h": 160,
            "sub": "Rapeable Girls",
            "teaser": "Post girls that are soo huggably rapeably soft"
        },
        "204679279": {
            "date": 1592575015,
            "file": "I&#039;m a teapot Ch. 2 - 028.jpg",
            "r": 475,
            "i": 98,
            "lr": {
                "id": 204716769,
                "date": 1592639988,
                "author": "Anonymous"
            },
            "b": 18,
            "author": "Anonymous",
            "imgurl": "1592575015781",
            "tn_w": 175,
            "tn_h": 250,
            "sub": "",
            "teaser": "Fuck you for hooking me on this isekai <s>thread<\/s> that had its first translated chapter uploaded four months ago, had its last translated chapter uploaded also four months ago and wasn&#039;t updated since then."
        },
        "204710950": {
            "date": 1592626091,
            "file": "etnm005.jpg",
            "r": 43,
            "i": 22,
            "lr": {
                "id": 204716768,
                "date": 1592639986,
                "author": "Anonymous"
            },
            "b": 19,
            "author": "Anonymous",
            "imgurl": "1592626091747",
            "tn_w": 212,
            "tn_h": 249,
            "sub": "",
            "teaser": "This is my wife, Et\u014d Kanami."
        },
        "204596893": {
            "date": 1592427324,
            "file": "2EC43A90-27EB-4326-9C63-37BEAE2966C9.jpg",
            "r": 425,
            "i": 213,
            "lr": {
                "id": 204716764,
                "date": 1592639980,
                "author": "Anonymous"
            },
            "b": 20,
            "author": "Anonymous",
            "imgurl": "1592427324629",
            "tn_w": 187,
            "tn_h": 250,
            "sub": "Drawthread",
            "teaser": "Make or request \/a\/rt"
        },
        "204716761": {
            "date": 1592639964,
            "file": "IMG_20200321_031604.jpg",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204716761
            },
            "b": 21,
            "author": "Anonymous",
            "imgurl": "1592639964355",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Boku no Hero Academia",
            "teaser": "I think this arc gets too much hate for what it does"
        },
        "204685107": {
            "date": 1592585019,
            "file": "x15.png",
            "r": 100,
            "i": 47,
            "lr": {
                "id": 204716759,
                "date": 1592639962,
                "author": "Anonymous"
            },
            "b": 22,
            "author": "Anonymous",
            "imgurl": "1592585019571",
            "tn_w": 175,
            "tn_h": 250,
            "sub": "",
            "teaser": "Do you like thicc girls? How thicc is enough?"
        },
        "204678149": {
            "date": 1592572779,
            "file": "Bake_The_Cake.png",
            "r": 321,
            "i": 109,
            "lr": {
                "id": 204716753,
                "date": 1592639944,
                "author": "Anonymous"
            },
            "b": 23,
            "author": "Anonymous",
            "imgurl": "1592572779807",
            "tn_w": 131,
            "tn_h": 250,
            "sub": "ITT",
            "teaser": "Characters that lost in the worst way possible."
        },
        "204696585": {
            "date": 1592602618,
            "file": "L56DWMF.png",
            "r": 152,
            "i": 56,
            "lr": {
                "id": 204716750,
                "date": 1592639935,
                "author": "Anonymous"
            },
            "b": 24,
            "author": "Anonymous",
            "imgurl": "1592602618428",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "\/ourgoddess\/",
            "teaser": ""
        },
        "204715723": {
            "date": 1592636828,
            "file": "578FF356-7617-4B8F-8397-F39CB208D5FA.png",
            "r": 22,
            "i": 10,
            "lr": {
                "id": 204716744,
                "date": 1592639908,
                "author": "Anonymous"
            },
            "b": 25,
            "author": "Anonymous",
            "imgurl": "1592636828326",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "ITT tropes you absolutely hate &gt;mc is the protagonist"
        },
        "204693357": {
            "date": 1592597322,
            "file": "0288-017.jpg",
            "r": 164,
            "i": 67,
            "lr": {
                "id": 204716743,
                "date": 1592639906,
                "author": "Anonymous"
            },
            "b": 26,
            "author": "Anonymous",
            "imgurl": "1592597322239",
            "tn_w": 166,
            "tn_h": 250,
            "sub": "Hunter x Hunter",
            "teaser": "Was Youpi the most based ant?"
        },
        "204715645": {
            "date": 1592636615,
            "file": "maxresdefault.jpg",
            "r": 27,
            "i": 9,
            "lr": {
                "id": 204716742,
                "date": 1592639905,
                "author": "Anonymous"
            },
            "b": 27,
            "author": "Anonymous",
            "imgurl": "1592636615370",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "&gt;I&#039;m one of the 3 knight classes and have one of the most busted noble phanta- &gt;AAAAAAGGGGHHHHHH A JAPANESE SCHOOL TEACHER  &gt;SAVE ME MORDRED"
        },
        "204630127": {
            "date": 1592489121,
            "file": "sensei.png",
            "r": 430,
            "i": 63,
            "lr": {
                "id": 204716740,
                "date": 1592639905,
                "author": "Anonymous"
            },
            "b": 28,
            "author": "Anonymous",
            "imgurl": "1592489121524",
            "tn_w": 198,
            "tn_h": 250,
            "sub": "",
            "teaser": "&gt;when I get home I won&#039;t be alone &gt;I&#039;ll be with a boy! a boy I&#039;m supporting! &gt;and we&#039;ll have dinner together! This woman is hopeless. It seems she&#039;s more excited about having someone in her apartment than finding out about why Kurose tried to take his own life. If she wants companionship, she should seek it in someone her own age, NOT in her student."
        },
        "204716194": {
            "date": 1592638190,
            "file": "maxresdefault.jpg",
            "r": 14,
            "i": 2,
            "lr": {
                "id": 204716741,
                "date": 1592639904,
                "author": "Anonymous"
            },
            "b": 29,
            "author": "Anonymous",
            "imgurl": "1592638190125",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Baki Season 4",
            "teaser": "Muh boy, didn&#039;t deserve such harsh treatment..."
        },
        "204715706": {
            "date": 1592636794,
            "file": "[ShowY] Yesterday wo Utatte - 10 [790C0344].mkv_snapshot_18.49_[2020.06.20_02.04.20].jpg",
            "r": 7,
            "i": 2,
            "lr": {
                "id": 204716737,
                "date": 1592639895,
                "author": "Anonymous"
            },
            "b": 30,
            "author": "Anonymous",
            "imgurl": "1592636794320",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "I fucking hate this cunt."
        },
        "204691355": {
            "date": 1592594171,
            "file": "08.jpg",
            "r": 143,
            "i": 35,
            "lr": {
                "id": 204716735,
                "date": 1592639895,
                "author": "Anonymous"
            },
            "b": 31,
            "author": "Anonymous",
            "imgurl": "1592594171341",
            "tn_w": 159,
            "tn_h": 250,
            "sub": "Mato Seihei No Slave",
            "teaser": "Tenka is OK, I repeat, she&#039;s OK https:\/\/manamoa48.net\/bbs\/board.php?bo_table=manga&amp;wr_id=3449654"
        },
        "204715022": {
            "date": 1592634889,
            "file": "Abigail Williams Fate.jpg",
            "r": 2,
            "i": 0,
            "lr": {
                "id": 204716736,
                "date": 1592639894,
                "author": "Anonymous"
            },
            "b": 32,
            "author": "Anonymous",
            "imgurl": "1592634889897",
            "tn_w": 250,
            "tn_h": 156,
            "sub": "",
            "teaser": "What do you think should be the next Fate animated project after Camelot is done?"
        },
        "204692752": {
            "date": 1592596355,
            "file": "This is a MtG Manga, I swear.png",
            "r": 121,
            "i": 56,
            "lr": {
                "id": 204716731,
                "date": 1592639886,
                "author": "Anonymous"
            },
            "b": 33,
            "author": "Anonymous",
            "imgurl": "1592596355634",
            "tn_w": 174,
            "tn_h": 250,
            "sub": "Destroy All Humankind. They Can&#039;t Be Regenerated ch.19",
            "teaser": "New chapter of the best Magic the Gathering media to come out in years is out. https:\/\/manga.fascans.com\/manga\/destroy-all-humankind-they-cant-be-regenerated\/19\/2"
        },
        "204666110": {
            "date": 1592545521,
            "file": "1585035110312.jpg",
            "r": 405,
            "i": 108,
            "lr": {
                "id": 204716727,
                "date": 1592639870,
                "author": "Anonymous"
            },
            "b": 34,
            "author": "Anonymous",
            "imgurl": "1592545521161",
            "tn_w": 250,
            "tn_h": 187,
            "sub": "",
            "teaser": "Sex with Asuka"
        },
        "204700935": {
            "date": 1592609073,
            "file": "1465675698333.png",
            "r": 246,
            "i": 117,
            "lr": {
                "id": 204716725,
                "date": 1592639868,
                "author": "Anonymous"
            },
            "b": 35,
            "author": "Anonymous",
            "imgurl": "1592609073883",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Weekend Waifu Drawthread",
            "teaser": ""
        },
        "204715570": {
            "date": 1592636375,
            "file": "49951v1.jpg",
            "r": 14,
            "i": 0,
            "lr": {
                "id": 204716724,
                "date": 1592639868,
                "author": "Anonymous"
            },
            "b": 36,
            "author": "Anonymous",
            "imgurl": "1592636375871",
            "tn_w": 175,
            "tn_h": 250,
            "sub": "My Story Before I, Who Was Scared of Males, Became a Porn Actress",
            "teaser": "New chapter out. https:\/\/mangadex.org\/chapter\/931685\/1"
        },
        "204708528": {
            "date": 1592621618,
            "file": "1412412412341.png",
            "r": 111,
            "i": 19,
            "lr": {
                "id": 204716719,
                "date": 1592639857,
                "author": "Anonymous"
            },
            "b": 37,
            "author": "Anonymous",
            "imgurl": "1592621618632",
            "tn_w": 250,
            "tn_h": 244,
            "sub": "jojolion",
            "teaser": "&gt;tooru is behind ALL of this how does this make you feel?"
        },
        "204715955": {
            "date": 1592637468,
            "file": "001.png",
            "r": 24,
            "i": 22,
            "lr": {
                "id": 204716714,
                "date": 1592639842,
                "author": "Anonymous"
            },
            "b": 38,
            "author": "Anonymous",
            "imgurl": "1592637468675",
            "tn_w": 176,
            "tn_h": 250,
            "sub": "Kaiji",
            "teaser": "Chapter 354 is out <s>IT&#039;S HAPPENING<\/s>"
        },
        "204701173": {
            "date": 1592609401,
            "file": "400A6391-81F8-4A9F-880B-949EBA894C7C.jpg",
            "r": 40,
            "i": 5,
            "lr": {
                "id": 204716709,
                "date": 1592639821,
                "author": "Anonymous"
            },
            "b": 39,
            "author": "Anonymous",
            "imgurl": "1592609401631",
            "tn_w": 248,
            "tn_h": 250,
            "sub": "",
            "teaser": "Is he the best written character in Naruto?"
        },
        "204645527": {
            "date": 1592510666,
            "file": "8man.jpg",
            "r": 249,
            "i": 39,
            "lr": {
                "id": 204716703,
                "date": 1592639812,
                "author": "Anonymous"
            },
            "b": 40,
            "author": "Anonymous",
            "imgurl": "1592510666668",
            "tn_w": 250,
            "tn_h": 250,
            "sub": "Oregairu",
            "teaser": "What do you think of Hachiman?"
        },
        "204586856": {
            "date": 1592412190,
            "file": "no s3 room.jpg",
            "r": 403,
            "i": 179,
            "lr": {
                "id": 204716702,
                "date": 1592639809,
                "author": "Anonymous"
            },
            "b": 41,
            "author": "Anonymous",
            "imgurl": "1592412190598",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "snek",
            "teaser": "Prey for s3"
        },
        "204696205": {
            "date": 1592602055,
            "file": "1567538530479.jpg",
            "r": 80,
            "i": 19,
            "lr": {
                "id": 204716697,
                "date": 1592639792,
                "author": "Anonymous"
            },
            "b": 42,
            "author": "Anonymous",
            "imgurl": "1592602055964",
            "tn_w": 187,
            "tn_h": 250,
            "sub": "",
            "teaser": "Why does she make people so mad?"
        },
        "204689197": {
            "date": 1592591235,
            "file": "b (52).png",
            "r": 486,
            "i": 159,
            "lr": {
                "id": 204716696,
                "date": 1592639791,
                "author": "Anonymous"
            },
            "b": 43,
            "author": "Anonymous",
            "imgurl": "1592591235717",
            "tn_w": 249,
            "tn_h": 188,
            "sub": "Tower of God Anime",
            "teaser": "Animeonly read the webtoon this is the worst adaptation ever made &gt;all character have a different personality &gt;all scene are cutted or changed every episode is a 100% filler &gt;the greatest love story ever Told Androssi x Baam cutted, image if in Bleach director choice to cut Rukia and Ichigo scenes &gt;all dark theme of ToG cutted to make an Anime for children ToG&#039;s Future died , no more 2nd season, no more Zahard&#039;s spin off , it could be a global success and cruncyroll give the job to a make cash studio."
        },
        "204716686": {
            "date": 1592639759,
            "file": "d27.png",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204716686
            },
            "b": 44,
            "author": "Anonymous",
            "imgurl": "1592639759428",
            "tn_w": 175,
            "tn_h": 250,
            "sub": "WonDance",
            "teaser": "Goddam what a slut. Why aren&#039;t you reading the best dancing manag of all time \/a\/?"
        },
        "204676652": {
            "date": 1592569668,
            "file": "nene huge tits.gif",
            "r": 271,
            "i": 142,
            "lr": {
                "id": 204716683,
                "date": 1592639756,
                "author": "Anonymous"
            },
            "b": 45,
            "author": "Anonymous",
            "imgurl": "1592569668699",
            "tn_w": 250,
            "tn_h": 139,
            "sub": "",
            "teaser": "Your opinion on oppai loli in anime?"
        },
        "204699248": {
            "date": 1592606712,
            "file": "Nyamo.png",
            "r": 57,
            "i": 13,
            "lr": {
                "id": 204716678,
                "date": 1592639746,
                "author": "Anonymous"
            },
            "b": 46,
            "author": "Anonymous",
            "imgurl": "1592606712729",
            "tn_w": 250,
            "tn_h": 187,
            "sub": "Minamo Kurosawa",
            "teaser": "I&#039;ve always wondered about her was she promiscuous in college or were she and Yukari both &#039;in the closet&#039; about their relationship in the series?"
        },
        "204716673": {
            "date": 1592639729,
            "file": "mpv-shot0001.jpg",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204716673
            },
            "b": 47,
            "author": "Anonymous",
            "imgurl": "1592639729277",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "Pino"
        },
        "204694014": {
            "date": 1592598448,
            "file": "x14e.png",
            "r": 122,
            "i": 92,
            "lr": {
                "id": 204716668,
                "date": 1592639710,
                "author": "Anonymous"
            },
            "b": 48,
            "author": "Anonymous",
            "imgurl": "1592598448537",
            "tn_w": 176,
            "tn_h": 250,
            "sub": "",
            "teaser": "OPT: One Page Thread. Encourage people to read a manga by posting a page of it."
        },
        "204651943": {
            "date": 1592520209,
            "file": "akari.gif",
            "r": 207,
            "i": 80,
            "lr": {
                "id": 204716661,
                "date": 1592639669,
                "author": "Anonymous"
            },
            "b": 49,
            "author": "Anonymous",
            "imgurl": "1592520209486",
            "tn_w": 180,
            "tn_h": 250,
            "sub": "",
            "teaser": "Akari loev A&amp;W root beer"
        },
        "204703574": {
            "date": 1592612853,
            "file": "UjKWMge.jpg",
            "r": 83,
            "i": 25,
            "lr": {
                "id": 204716651,
                "date": 1592639643,
                "author": "Anonymous"
            },
            "b": 50,
            "author": "Anonymous",
            "imgurl": "1592612853105",
            "tn_w": 169,
            "tn_h": 250,
            "sub": "Bokuben",
            "teaser": "Mafuyu is the best and cannot be stopped."
        },
        "204677630": {
            "date": 1592571798,
            "file": "PhoenixManAnime.png",
            "r": 209,
            "i": 37,
            "lr": {
                "id": 204716649,
                "date": 1592639641,
                "author": "Anonymous"
            },
            "b": 51,
            "author": "Anonymous",
            "imgurl": "1592571798707",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "One Punch Man",
            "teaser": "He&#039;ll revive the hype, I know he will"
        },
        "204688995": {
            "date": 1592590955,
            "file": "12.jpg",
            "r": 80,
            "i": 19,
            "lr": {
                "id": 204716647,
                "date": 1592639635,
                "author": "Anonymous"
            },
            "b": 52,
            "author": "Anonymous",
            "imgurl": "1592590955740",
            "tn_w": 175,
            "tn_h": 250,
            "sub": "",
            "teaser": "Have faith in shounen anons, he will surpass the barrier of their age gap and make her completely fall in love with him <s>if she is not already falling for him a bit, her mixed signals are truly too much.<\/s>"
        },
        "204712569": {
            "date": 1592629030,
            "file": "445465af.jpg",
            "r": 15,
            "i": 0,
            "lr": {
                "id": 204716630,
                "date": 1592639603,
                "author": "Anonymous"
            },
            "b": 53,
            "author": "Anonymous",
            "imgurl": "1592629030428",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Gintama",
            "teaser": "New Anime 2021"
        },
        "204713297": {
            "date": 1592630557,
            "file": "Cute wife.jpg",
            "r": 19,
            "i": 3,
            "lr": {
                "id": 204716596,
                "date": 1592639489,
                "author": "Anonymous"
            },
            "b": 54,
            "author": "Anonymous",
            "imgurl": "1592630557537",
            "tn_w": 132,
            "tn_h": 249,
            "sub": "",
            "teaser": "How do I find a waifu?"
        },
        "204716424": {
            "date": 1592638877,
            "file": "1585409401093.png",
            "r": 1,
            "i": 0,
            "lr": {
                "id": 204716594,
                "date": 1592639488,
                "author": "Anonymous"
            },
            "b": 55,
            "author": "Anonymous",
            "imgurl": "1592638877073",
            "tn_w": 250,
            "tn_h": 244,
            "sub": "",
            "teaser": "how did the level 68 ninja kill a level 76 demon lord?"
        },
        "204716551": {
            "date": 1592639344,
            "file": "1589102046235.webm",
            "r": 2,
            "i": 0,
            "lr": {
                "id": 204716593,
                "date": 1592639487,
                "author": "Anonymous"
            },
            "b": 56,
            "author": "Anonymous",
            "imgurl": "1592639344882",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "ITT: &quot;kino&quot; fight scenes"
        },
        "204710689": {
            "date": 1592625610,
            "file": "000a.jpg",
            "r": 168,
            "i": 161,
            "lr": {
                "id": 204716584,
                "date": 1592639442,
                "author": "Anonymous"
            },
            "b": 57,
            "author": "Anonymous",
            "imgurl": "1592625610289",
            "tn_w": 250,
            "tn_h": 110,
            "sub": "",
            "teaser": "Alright, faggots. Suehiro Maruo story-time part 2 part 1 is here &gt;&gt;204526530 let&#039;s go"
        },
        "204715880": {
            "date": 1592637253,
            "file": "mpv-shot0002.jpg",
            "r": 3,
            "i": 0,
            "lr": {
                "id": 204716571,
                "date": 1592639399,
                "author": "Anonymous"
            },
            "b": 58,
            "author": "Anonymous",
            "imgurl": "1592637253536",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "Why are Fubuki and Saitama so perfect together?"
        },
        "204674886": {
            "date": 1592565604,
            "file": "6ade116e8c33e6250540bc34d9951367.jpg",
            "r": 159,
            "i": 50,
            "lr": {
                "id": 204716546,
                "date": 1592639332,
                "author": "Anonymous"
            },
            "b": 59,
            "author": "Anonymous",
            "imgurl": "1592565604824",
            "tn_w": 192,
            "tn_h": 250,
            "sub": "Okaa-san Online",
            "teaser": "It&#039;s Mamako&#039;s day! Everyone should always try to make their mother smile!"
        },
        "204716355": {
            "date": 1592638671,
            "file": "3727644b109279e2cb405ac89b0f293f1452549294_full.jpg",
            "r": 2,
            "i": 0,
            "lr": {
                "id": 204716543,
                "date": 1592639322,
                "author": "Anonymous"
            },
            "b": 60,
            "author": "Anonymous",
            "imgurl": "1592638671657",
            "tn_w": 166,
            "tn_h": 250,
            "sub": "",
            "teaser": "Did it deserve the hate?"
        },
        "204716026": {
            "date": 1592637659,
            "file": "20200620_151922.jpg",
            "r": 1,
            "i": 0,
            "lr": {
                "id": 204716531,
                "date": 1592639264,
                "author": "Anonymous"
            },
            "b": 61,
            "author": "Anonymous",
            "imgurl": "1592637659577",
            "tn_w": 152,
            "tn_h": 250,
            "sub": "",
            "teaser": "Why hasn&#039;t Afro Tanaka been translated yet?"
        },
        "204692969": {
            "date": 1592596694,
            "file": "1592076196838.png",
            "r": 80,
            "i": 28,
            "lr": {
                "id": 204716520,
                "date": 1592639234,
                "author": "Anonymous"
            },
            "b": 62,
            "author": "Anonymous",
            "imgurl": "1592596694843",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Bakarina",
            "teaser": "MONKEYFACE!"
        },
        "204670490": {
            "date": 1592555487,
            "file": "1563389029287.jpg",
            "r": 170,
            "i": 88,
            "lr": {
                "id": 204716521,
                "date": 1592639235,
                "author": "Anonymous"
            },
            "b": 63,
            "author": "Anonymous",
            "imgurl": "1592555487221",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "bakuretsu bakuretsu la la la"
        },
        "204709635": {
            "date": 1592623599,
            "file": "file.png",
            "r": 33,
            "i": 8,
            "lr": {
                "id": 204716513,
                "date": 1592639203,
                "author": "Anonymous"
            },
            "b": 64,
            "author": "Anonymous",
            "imgurl": "1592623599854",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "Do you want to be her friend?"
        },
        "204716508": {
            "date": 1592639191,
            "file": "Nekomonogatari Black Episode 4.mkv_snapshot_06.15.918.png",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204716508
            },
            "b": 65,
            "author": "Anonymous",
            "imgurl": "1592639191940",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "wow he&#039;s just like me"
        },
        "204674670": {
            "date": 1592565135,
            "file": "20200619_070420.jpg",
            "r": 126,
            "i": 36,
            "lr": {
                "id": 204716498,
                "date": 1592639172,
                "author": "Anonymous"
            },
            "b": 66,
            "author": "Anonymous",
            "imgurl": "1592565135494",
            "tn_w": 250,
            "tn_h": 250,
            "sub": "Detective Conan",
            "teaser": "&gt;yesterday marked Conan&#039;s 26th year of existence Jesus, that&#039;s way too long"
        },
        "204714244": {
            "date": 1592632864,
            "file": "sample_b8200695a077c5e8355cc89550603b7e.png",
            "r": 7,
            "i": 7,
            "lr": {
                "id": 204716496,
                "date": 1592639157,
                "author": "Anonymous"
            },
            "b": 67,
            "author": "Anonymous",
            "imgurl": "1592632864204",
            "tn_w": 155,
            "tn_h": 250,
            "sub": "",
            "teaser": "Do you like Illustrious?"
        },
        "204625277": {
            "date": 1592480153,
            "file": "[HorribleSubs] Hachi-nan tte, Sore wa Nai deshou! - 11 [720p].mkv_snapshot_14.12_[2020.06.11_10.31.04].jpg",
            "r": 397,
            "i": 78,
            "lr": {
                "id": 204716494,
                "date": 1592639153,
                "author": "Anonymous"
            },
            "b": 68,
            "author": "Anonymous",
            "imgurl": "1592480153286",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Hachi-nan tte, Sore wa Nai deshou!",
            "teaser": "It&#039;s finally time. Time for Welly McHamburgerandcheese to have a nice conversation with his brother Kurt about his wife and land."
        },
        "204642637": {
            "date": 1592506858,
            "file": "G-Fantasy cover.jpg",
            "r": 268,
            "i": 116,
            "lr": {
                "id": 204716493,
                "date": 1592639139,
                "author": "Anonymous"
            },
            "b": 69,
            "author": "Anonymous",
            "imgurl": "1592506858826",
            "tn_w": 175,
            "tn_h": 250,
            "sub": "Jibaku Shounen Hanako-kun chap 67",
            "teaser": "https:\/\/mangadex.org\/chapter\/930123\/1 It&#039;s here, boys!"
        },
        "204678476": {
            "date": 1592573369,
            "file": "Sevens Mimi.jpg",
            "r": 377,
            "i": 78,
            "lr": {
                "id": 204716492,
                "date": 1592639138,
                "author": "Anonymous"
            },
            "b": 70,
            "author": "Anonymous",
            "imgurl": "1592573369110",
            "tn_w": 250,
            "tn_h": 166,
            "sub": "Yu-Gi-Oh! SEVENS",
            "teaser": "Goha&#039;s Committee for State Security is sending one of their agents to collect intelligence on Yuga and his friends later today. Also, the countdown to Fusion summoning debuting in the new Format of the game has been initiated."
        },
        "204714136": {
            "date": 1592632604,
            "file": "tanuki.jpg",
            "r": 5,
            "i": 1,
            "lr": {
                "id": 204716484,
                "date": 1592639116,
                "author": "Anonymous"
            },
            "b": 71,
            "author": "Anonymous",
            "imgurl": "1592632604869",
            "tn_w": 250,
            "tn_h": 249,
            "sub": "BNA image thread",
            "teaser": "please oh please does anyone have the tanuki pictures"
        },
        "204713135": {
            "date": 1592630243,
            "file": "I used to have it all.jpg",
            "r": 6,
            "i": 0,
            "lr": {
                "id": 204716483,
                "date": 1592639114,
                "author": "Anonymous"
            },
            "b": 72,
            "author": "Anonymous",
            "imgurl": "1592630243531",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "What are some manga that pops up in your mind that had some big falls from grace? Really popular stuff that lost tons of readers&#039; interest with spectacularly bad arcs. The ones I can think of at the top of my head  Seven deadly sins Bleach Magi Shokugeki soma Soul Eater"
        },
        "204673124": {
            "date": 1592561671,
            "file": "[HorribleSubs] Listeners - 11 [720p].mkv_snapshot_24.14_[2020.06.12_15.38.20].jpg",
            "r": 224,
            "i": 78,
            "lr": {
                "id": 204716480,
                "date": 1592639096,
                "author": "Anonymous"
            },
            "b": 73,
            "author": "Anonymous",
            "imgurl": "1592561671035",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Listeners",
            "teaser": "All you need is love. Mu in the sky with diamonds. Echo is the walrus. What are your final thoughts on Listeners?"
        },
        "204677106": {
            "date": 1592570698,
            "file": "1527770835449.jpg",
            "r": 348,
            "i": 140,
            "lr": {
                "id": 204716476,
                "date": 1592639084,
                "author": "Anonymous"
            },
            "b": 74,
            "author": "Anonymous",
            "imgurl": "1592570698393",
            "tn_w": 250,
            "tn_h": 142,
            "sub": "Precure",
            "teaser": "Who&#039;s your favorite yellow?"
        },
        "204588978": {
            "date": 1592415546,
            "file": "x1.png",
            "r": 468,
            "i": 167,
            "lr": {
                "id": 204716459,
                "date": 1592639014,
                "author": "Anonymous"
            },
            "b": 75,
            "author": "Anonymous",
            "imgurl": "1592415546352",
            "tn_w": 174,
            "tn_h": 250,
            "sub": "Machikado Mazoku",
            "teaser": "Chapter 72 is out, dumping."
        },
        "204709548": {
            "date": 1592623437,
            "file": "1592621912219.png",
            "r": 28,
            "i": 8,
            "lr": {
                "id": 204716442,
                "date": 1592638944,
                "author": "Anonymous"
            },
            "b": 76,
            "author": "Anonymous",
            "imgurl": "1592623437719",
            "tn_w": 250,
            "tn_h": 206,
            "sub": "",
            "teaser": "How do you get past her?"
        },
        "204713023": {
            "date": 1592630003,
            "file": "1577739150542.png",
            "r": 22,
            "i": 15,
            "lr": {
                "id": 204716438,
                "date": 1592638934,
                "author": "Anonymous"
            },
            "b": 77,
            "author": "Anonymous",
            "imgurl": "1592630003379",
            "tn_w": 250,
            "tn_h": 113,
            "sub": "WEG:",
            "teaser": "Thoughts on whatever anime you recently watched. Post &#039;em."
        },
        "204714355": {
            "date": 1592633117,
            "file": "sakurasou.jpg",
            "r": 6,
            "i": 2,
            "lr": {
                "id": 204716435,
                "date": 1592638907,
                "author": "Anonymous"
            },
            "b": 78,
            "author": "Anonymous",
            "imgurl": "1592633117535",
            "tn_w": 166,
            "tn_h": 250,
            "sub": "",
            "teaser": "ITT Romance animes that will make you feel something"
        },
        "204713005": {
            "date": 1592629975,
            "file": "Trunks_DBZ_Ep_131_001.png",
            "r": 24,
            "i": 4,
            "lr": {
                "id": 204716419,
                "date": 1592638870,
                "author": "Anonymous"
            },
            "b": 79,
            "author": "Anonymous",
            "imgurl": "1592629975626",
            "tn_w": 193,
            "tn_h": 250,
            "sub": "",
            "teaser": "Why is Future Trunks so much more compelling a character than the entire rest of the cast combined?"
        },
        "204714471": {
            "date": 1592633467,
            "file": "1592631043475.png",
            "r": 3,
            "i": 1,
            "lr": {
                "id": 204716415,
                "date": 1592638865,
                "author": "Anonymous"
            },
            "b": 80,
            "author": "Anonymous",
            "imgurl": "1592633467163",
            "tn_w": 146,
            "tn_h": 250,
            "sub": "",
            "teaser": "Why do Shonen have to change artstyle Jesus christ fuck Toriyama this is peak aesthetic fuck moe fuck fuck moe"
        },
        "204692796": {
            "date": 1592596416,
            "file": "Screenshot_20200619-160846.png",
            "r": 147,
            "i": 22,
            "lr": {
                "id": 204716407,
                "date": 1592638839,
                "author": "Anonymous"
            },
            "b": 81,
            "author": "Anonymous",
            "imgurl": "1592596416710",
            "tn_w": 250,
            "tn_h": 112,
            "sub": "",
            "teaser": "mfw people have waifus from evangelion, even though that completely goes against the message and narrative of the show"
        },
        "204679525": {
            "date": 1592575561,
            "file": "1488648029766.jpg",
            "r": 240,
            "i": 134,
            "lr": {
                "id": 204716402,
                "date": 1592638819,
                "author": "Anonymous"
            },
            "b": 82,
            "author": "Anonymous",
            "imgurl": "1592575561455",
            "tn_w": 250,
            "tn_h": 208,
            "sub": "",
            "teaser": "Friends, let us amuse ourselves by showing off our beautiful tapestries with scenes from oriental shows."
        },
        "204665240": {
            "date": 1592543515,
            "file": "DzLLJYeWoAAFrresubkatsu.jpg",
            "r": 481,
            "i": 177,
            "lr": {
                "id": 204716396,
                "date": 1592638805,
                "author": "Anonymous"
            },
            "b": 83,
            "author": "Anonymous",
            "imgurl": "1592543515781",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Mewkledreamy, Aipare and PriChan",
            "teaser": "4ikatsu confirmed"
        },
        "204692372": {
            "date": 1592595781,
            "file": "0983-001.jpg",
            "r": 397,
            "i": 80,
            "lr": {
                "id": 204716461,
                "date": 1592639026,
                "author": "Anonymous"
            },
            "b": 84,
            "author": "Anonymous",
            "imgurl": "1592595781732",
            "tn_w": 170,
            "tn_h": 250,
            "sub": "One Piece Cover",
            "teaser": "Why is Oda such a fag? Why is that guy even alive? All the suspense, all the sadness, the story... LOL JK HE SURVIVED THE BEHEADING  KEK"
        },
        "204692158": {
            "date": 1592595449,
            "file": "chnny.png",
            "r": 158,
            "i": 83,
            "lr": {
                "id": 204716329,
                "date": 1592638586,
                "author": "Anonymous"
            },
            "b": 85,
            "author": "Anonymous",
            "imgurl": "1592595449693",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Is the Order a Rabbit ?",
            "teaser": "Coffee is Good for You"
        },
        "204711144": {
            "date": 1592626408,
            "file": "fat.png",
            "r": 18,
            "i": 1,
            "lr": {
                "id": 204716310,
                "date": 1592638516,
                "author": "Anonymous"
            },
            "b": 86,
            "author": "Anonymous",
            "imgurl": "1592626408237",
            "tn_w": 249,
            "tn_h": 184,
            "sub": "",
            "teaser": "Do girls like this really exist?"
        },
        "204658136": {
            "date": 1592530008,
            "file": "mirko.jpg",
            "r": 238,
            "i": 58,
            "lr": {
                "id": 204716287,
                "date": 1592638438,
                "author": "Anonymous"
            },
            "b": 87,
            "author": "Anonymous",
            "imgurl": "1592530008050",
            "tn_w": 203,
            "tn_h": 250,
            "sub": "",
            "teaser": "What is your opinion of character like this?"
        },
        "204655301": {
            "date": 1592525256,
            "file": "1441802944-e579c0a129f601ceb957840b25b3637f.png",
            "r": 271,
            "i": 64,
            "lr": {
                "id": 204716282,
                "date": 1592638410,
                "author": "Anonymous"
            },
            "b": 88,
            "author": "Anonymous",
            "imgurl": "1592525256141",
            "tn_w": 244,
            "tn_h": 250,
            "sub": "How the fuck did he got shot and die?",
            "teaser": "&gt;Be Yoh Asakura &gt;Can summon Samurai and Earth Spirit &gt;Has giant lightsaber &gt;Killed God &gt;Gets shot by low level goons. Explain"
        },
        "204715630": {
            "date": 1592636588,
            "file": "Screenshot (444).png",
            "r": 12,
            "i": 5,
            "lr": {
                "id": 204716335,
                "date": 1592638598,
                "author": "Anonymous"
            },
            "b": 89,
            "author": "Anonymous",
            "imgurl": "1592636588670",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "can someone give me a quick and concise rundown on why copyright infringement is so prevalent in japan? like: Bunny girl senpai.  How is this not plagiarism?"
        },
        "204710835": {
            "date": 1592625865,
            "file": "Volume-19---Page-169.png",
            "r": 105,
            "i": 25,
            "lr": {
                "id": 204716261,
                "date": 1592638377,
                "author": "Anonymous"
            },
            "b": 90,
            "author": "Anonymous",
            "imgurl": "1592625865094",
            "tn_w": 158,
            "tn_h": 250,
            "sub": "Jitsu Wa Watashi Wa storytime #19.5",
            "teaser": "Posting the last chapter of the night! Let&#039;s gooooo &gt;Last thread: &gt;&gt;204704249"
        },
        "204707275": {
            "date": 1592619337,
            "file": "yes_please.gif",
            "r": 21,
            "i": 13,
            "lr": {
                "id": 204716252,
                "date": 1592638346,
                "author": "Anonymous"
            },
            "b": 91,
            "author": "Anonymous",
            "imgurl": "1592619337318",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "&gt;protagonist is an ultra-ripped lolicon maid of dubious character &gt;deuteragonist is a Russian tundere loli &gt;tritagonist is a ferret"
        },
        "204708107": {
            "date": 1592620832,
            "file": "8a77e1260b6dd67d74bef5e4af7ea945.jpg",
            "r": 55,
            "i": 19,
            "lr": {
                "id": 204716244,
                "date": 1592638327,
                "author": "Anonymous"
            },
            "b": 92,
            "author": "Anonymous",
            "imgurl": "1592620832561",
            "tn_w": 176,
            "tn_h": 249,
            "sub": "",
            "teaser": "Kyaa! Anon I&#039;m changing in here!"
        },
        "204673546": {
            "date": 1592562695,
            "file": "12_1.jpg",
            "r": 388,
            "i": 153,
            "lr": {
                "id": 204716241,
                "date": 1592638322,
                "author": "Anonymous"
            },
            "b": 93,
            "author": "Anonymous",
            "imgurl": "1592562695393",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Shin Sakura Taisen",
            "teaser": "Final episode today"
        },
        "204685389": {
            "date": 1592585473,
            "file": "kunihiro.jpg",
            "r": 179,
            "i": 84,
            "lr": {
                "id": 204716235,
                "date": 1592638306,
                "author": "Anonymous"
            },
            "b": 94,
            "author": "Anonymous",
            "imgurl": "1592585473397",
            "tn_w": 250,
            "tn_h": 105,
            "sub": "Saki",
            "teaser": "Did you get into Mahjong because of Saki?"
        },
        "204712048": {
            "date": 1592627961,
            "file": "Hidamari Sketch - 03.mkv_snapshot_05.22.303.jpg",
            "r": 17,
            "i": 8,
            "lr": {
                "id": 204716228,
                "date": 1592638289,
                "author": "Anonymous"
            },
            "b": 95,
            "author": "Anonymous",
            "imgurl": "1592627961045",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "how does she keep getting away with it? wide thread"
        },
        "204712249": {
            "date": 1592628377,
            "file": "1480303202219.gif",
            "r": 7,
            "i": 2,
            "lr": {
                "id": 204716215,
                "date": 1592638251,
                "author": "Anonymous"
            },
            "b": 96,
            "author": "Anonymous",
            "imgurl": "1592628377953",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "&gt;marble comes out of hiatus This could only mean that they are getting ready for Hidamari S5"
        },
        "204687759": {
            "date": 1592589239,
            "file": "1587946414744.png",
            "r": 87,
            "i": 33,
            "lr": {
                "id": 204716210,
                "date": 1592638224,
                "author": "Anonymous"
            },
            "b": 97,
            "author": "Anonymous",
            "imgurl": "1592589239715",
            "tn_w": 250,
            "tn_h": 212,
            "sub": "Heaven&#039;s Feel",
            "teaser": "What exactly is this expression trying to convey?"
        },
        "204713973": {
            "date": 1592632219,
            "file": "Eay33fZUYAAhD26.jpg",
            "r": 8,
            "i": 1,
            "lr": {
                "id": 204716203,
                "date": 1592638206,
                "author": "Anonymous"
            },
            "b": 98,
            "author": "Anonymous",
            "imgurl": "1592632219534",
            "tn_w": 206,
            "tn_h": 250,
            "sub": "",
            "teaser": "Breakout star VA this season, Sugiyama Riho (VA for Minare from Wave, Listen to Me!) reveals that she was told she couldn&#039;t get into the industry because she didn&#039;t had an &quot;anime voice&quot;. https:\/\/twitter.com\/sugiyama_riho\/status\/1273875939861032960?s=19"
        },
        "204699181": {
            "date": 1592606618,
            "file": "esdeath.jpg",
            "r": 98,
            "i": 63,
            "lr": {
                "id": 204716196,
                "date": 1592638192,
                "author": "Anonymous"
            },
            "b": 99,
            "author": "Anonymous",
            "imgurl": "1592606618491",
            "tn_w": 238,
            "tn_h": 249,
            "sub": "",
            "teaser": "Post perfection"
        },
        "204716192": {
            "date": 1592638187,
            "file": "X_Wiki_Thumb.jpg",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204716192
            },
            "b": 100,
            "author": "Anonymous",
            "imgurl": "1592638187811",
            "tn_w": 241,
            "tn_h": 250,
            "sub": "",
            "teaser": "Anime dat you want to see in new, fresh version. For me X - old is just simply bad. Wonky animation and shitty ending."
        },
        "204716189": {
            "date": 1592638184,
            "file": "Oceana.jpg",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204716189
            },
            "b": 101,
            "author": "Anonymous",
            "imgurl": "1592638184901",
            "tn_w": 157,
            "tn_h": 250,
            "sub": "",
            "teaser": "will you fuck your medarot"
        },
        "204713160": {
            "date": 1592630303,
            "file": "Ulti_portrait.png",
            "r": 6,
            "i": 3,
            "lr": {
                "id": 204716151,
                "date": 1592638072,
                "author": "Anonymous"
            },
            "b": 102,
            "author": "Anonymous",
            "imgurl": "1592630303366",
            "tn_w": 219,
            "tn_h": 219,
            "sub": "Reminder",
            "teaser": "She&#039;ll be luffy&#039;s gf"
        },
        "204705596": {
            "date": 1592616138,
            "file": "D3D1A76D-85B2-4113-95E2-BE7C4C4E4237.jpg",
            "r": 73,
            "i": 5,
            "lr": {
                "id": 204716140,
                "date": 1592638041,
                "author": "Anonymous"
            },
            "b": 103,
            "author": "Anonymous",
            "imgurl": "1592616138712",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Who was in charge of putting the Konoha 12 teams together?",
            "teaser": "And why did they put a prodigy like Sasuke with who were considered at the time the two most useless and talentless ninjas in the class?"
        },
        "204710672": {
            "date": 1592625578,
            "file": "[HorribleSubs] Kakushigoto - 12 [1080p].mkv_snapshot_21.56_[2020.06.19_22.57.59].jpg",
            "r": 12,
            "i": 4,
            "lr": {
                "id": 204716128,
                "date": 1592637993,
                "author": "Anonymous"
            },
            "b": 104,
            "author": "Anonymous",
            "imgurl": "1592625578189",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Kakushigoto 12",
            "teaser": "I cried like a little bitch. How about you anon?"
        },
        "204647426": {
            "date": 1592513370,
            "file": "Jobber redemption arc.jpg",
            "r": 418,
            "i": 62,
            "lr": {
                "id": 204716102,
                "date": 1592637910,
                "author": "Anonymous"
            },
            "b": 105,
            "author": "Anonymous",
            "imgurl": "1592513370135",
            "tn_w": 176,
            "tn_h": 250,
            "sub": "",
            "teaser": "Kengan chads will he job again?"
        },
        "204707795": {
            "date": 1592620249,
            "file": "penny.png",
            "r": 90,
            "i": 26,
            "lr": {
                "id": 204716083,
                "date": 1592637850,
                "author": "Anonymous"
            },
            "b": 106,
            "author": "Anonymous",
            "imgurl": "1592620249888",
            "tn_w": 250,
            "tn_h": 191,
            "sub": "",
            "teaser": "This was so obviously a japanese production that it might as well be an 80s anime"
        },
        "204712043": {
            "date": 1592627942,
            "file": "6fe42d7033975bd1eda669a4bab47700.jpg",
            "r": 21,
            "i": 21,
            "lr": {
                "id": 204716054,
                "date": 1592637761,
                "author": "Anonymous"
            },
            "b": 107,
            "author": "Anonymous",
            "imgurl": "1592627942601",
            "tn_w": 172,
            "tn_h": 250,
            "sub": "Girls that got married",
            "teaser": "Hard mode: white wedding dress"
        },
        "204696070": {
            "date": 1592601852,
            "file": "file.png",
            "r": 21,
            "i": 18,
            "lr": {
                "id": 204716027,
                "date": 1592637660,
                "author": "Anonymous"
            },
            "b": 108,
            "author": "Anonymous",
            "imgurl": "1592601852561",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "\/a\/ sings - Barakamon OP (Rashisa)",
            "teaser": "Calligraphers wanted. The autistic singing kind. lyrics, song, instrumental here https:\/\/drive.google.com\/open?id=18T_kOb7xe5eJENQdzj2Jk4C0uiMBRVYc &gt;deadline? Not yet for this track, but I have others you may be interested in \/a\/ss 3. &gt;\/a\/ss 3? Collective \/a\/ss Volume 3."
        },
        "204690578": {
            "date": 1592593109,
            "file": "latina pout 2.png",
            "r": 146,
            "i": 61,
            "lr": {
                "id": 204716008,
                "date": 1592637627,
                "author": "Anonymous"
            },
            "b": 109,
            "author": "Anonymous",
            "imgurl": "1592593109929",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "&gt;studio is called JC Staff &gt;their Staff does not consist of JCs"
        },
        "204706321": {
            "date": 1592617467,
            "file": "513KSz9M47L._AC_.jpg",
            "r": 50,
            "i": 11,
            "lr": {
                "id": 204716002,
                "date": 1592637619,
                "author": "Anonymous"
            },
            "b": 110,
            "author": "Anonymous",
            "imgurl": "1592617467595",
            "tn_w": 180,
            "tn_h": 250,
            "sub": "",
            "teaser": "I am glad we finally reached the point where \/a\/ no longer thinks this piece of shit is good."
        },
        "204715989": {
            "date": 1592637573,
            "file": "17913.jpg",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204715989
            },
            "b": 111,
            "author": "Anonymous",
            "imgurl": "1592637573653",
            "tn_w": 171,
            "tn_h": 250,
            "sub": "",
            "teaser": "&gt;kids escape to the human world &gt;they&#039;re captured by nwo pedophiles and sacrificed to moloch"
        },
        "204688191": {
            "date": 1592589860,
            "file": "gang_smartphone.jpg",
            "r": 285,
            "i": 151,
            "lr": {
                "id": 204715966,
                "date": 1592637490,
                "author": "Anonymous"
            },
            "b": 112,
            "author": "Anonymous",
            "imgurl": "1592589860889",
            "tn_w": 250,
            "tn_h": 242,
            "sub": "Inuyasha",
            "teaser": "&gt;ITT: we discuss how great the original series was &amp; how much of a fuck up the sequel yashahime will be"
        },
        "204692700": {
            "date": 1592596276,
            "file": "cove3.jpg",
            "r": 108,
            "i": 24,
            "lr": {
                "id": 204715954,
                "date": 1592637468,
                "author": "Anonymous"
            },
            "b": 113,
            "author": "Anonymous",
            "imgurl": "1592596276854",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "ITT: 1 trope you love and 1 you hate Love &gt;random light reflecting off glasses when they get pushed up Hate &gt;MC overreacting when they see a naked woman"
        },
        "204696512": {
            "date": 1592602510,
            "file": "tpluki87qyb11.jpg",
            "r": 74,
            "i": 23,
            "lr": {
                "id": 204715943,
                "date": 1592637432,
                "author": "Anonymous"
            },
            "b": 114,
            "author": "Anonymous",
            "imgurl": "1592602510326",
            "tn_w": 174,
            "tn_h": 250,
            "sub": "Fuck Izumi",
            "teaser": "I am in the middle of my first Gantz read and I can&#039;t stand Izumi. He&#039;s such a piece of shit. Why the fuck was he allowed to get away with mass murder and killing tae? I was really happy for Kei since he wasn&#039;t such a piece of shit anymore and I felt myself relating to him and then in an instant izumi just fucks him over. I know its Kei&#039;s fault for not killing him in the classroom when he had the chance but still the fact he&#039;s gotten away with so much makes me hate him. I hope Izumi dies by the end of this manga."
        },
        "204713717": {
            "date": 1592631576,
            "file": "nyto_dab.jpg",
            "r": 6,
            "i": 4,
            "lr": {
                "id": 204715930,
                "date": 1592637402,
                "author": "Anonymous"
            },
            "b": 115,
            "author": "Anonymous",
            "imgurl": "1592631576000",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "what the FUCK was this"
        },
        "204715415": {
            "date": 1592635915,
            "file": "main-qimg-53e24b6de92c84f554d3529e027399b8.jpg",
            "r": 2,
            "i": 1,
            "lr": {
                "id": 204715901,
                "date": 1592637306,
                "author": "Anonymous"
            },
            "b": 116,
            "author": "Anonymous",
            "imgurl": "1592635915593",
            "tn_w": 250,
            "tn_h": 174,
            "sub": "",
            "teaser": "Why did they never train uub in super?"
        },
        "204713942": {
            "date": 1592632148,
            "file": "berserk-finale-1187083-1280x0.jpg",
            "r": 5,
            "i": 0,
            "lr": {
                "id": 204715900,
                "date": 1592637306,
                "author": "Anonymous"
            },
            "b": 117,
            "author": "Anonymous",
            "imgurl": "1592632148229",
            "tn_w": 250,
            "tn_h": 141,
            "sub": "",
            "teaser": "How come despite Berserk&#039;s huge popularity so few mangas try to rip it off or imitate its aesthetic? I mean you&#039;ve got the occasional story like Claymore that kind of strays in that direction but most of the time it&#039;s silly JRPG shit. Or alternately they swing all the other way around and dump fantasy entirely in favor of historical drama."
        },
        "204715212": {
            "date": 1592635333,
            "file": "\u3082\u3057\u3001\u604b\u304c\u898b\u3048\u305f\u306a\u3089.jpg",
            "r": 1,
            "i": 0,
            "lr": {
                "id": 204715848,
                "date": 1592637153,
                "author": "Anonymous"
            },
            "b": 118,
            "author": "Anonymous",
            "imgurl": "1592635333796",
            "tn_w": 175,
            "tn_h": 250,
            "sub": "",
            "teaser": "&gt;go to all-girl school &gt;why are there so many lesbians Is this girl retarded?"
        },
        "204715838": {
            "date": 1592637119,
            "file": "1583930057779.png",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204715838
            },
            "b": 119,
            "author": "Anonymous",
            "imgurl": "1592637119758",
            "tn_w": 173,
            "tn_h": 250,
            "sub": "",
            "teaser": "It&#039;s time for another killy girl appreciation thread"
        },
        "204692414": {
            "date": 1592595851,
            "file": "Seto Kino.png",
            "r": 184,
            "i": 40,
            "lr": {
                "id": 204715835,
                "date": 1592637119,
                "author": "Anonymous"
            },
            "b": 120,
            "author": "Anonymous",
            "imgurl": "1592595851252",
            "tn_w": 227,
            "tn_h": 250,
            "sub": "",
            "teaser": "Every single scene he&#039;s in becomes kino."
        },
        "204709855": {
            "date": 1592624034,
            "file": "1572224311305.jpg",
            "r": 21,
            "i": 3,
            "lr": {
                "id": 204715810,
                "date": 1592637050,
                "author": "Anonymous"
            },
            "b": 121,
            "author": "Anonymous",
            "imgurl": "1592624034700",
            "tn_w": 163,
            "tn_h": 250,
            "sub": "Why do women love their kidnappers?",
            "teaser": ""
        },
        "204714741": {
            "date": 1592634155,
            "file": "cultural festival.png",
            "r": 11,
            "i": 5,
            "lr": {
                "id": 204715799,
                "date": 1592637026,
                "author": "Anonymous"
            },
            "b": 122,
            "author": "Anonymous",
            "imgurl": "1592634155303",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "&gt;Meanwhile in \/a\/&#039;s Cultural Festival"
        },
        "204715794": {
            "date": 1592637013,
            "file": "Chitanda.png",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204715794
            },
            "b": 123,
            "author": "Anonymous",
            "imgurl": "1592637013717",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Hyouka",
            "teaser": "Best anime I have ever watched, hands down. Was the peak of my anime watching career. Shame the guy who directed it had to die, along with his colleagues, in such a horrible way. It gives the anime a different vibe."
        },
        "204691057": {
            "date": 1592593775,
            "file": "images (91).jpg",
            "r": 132,
            "i": 32,
            "lr": {
                "id": 204715786,
                "date": 1592636993,
                "author": "Anonymous"
            },
            "b": 124,
            "author": "Anonymous",
            "imgurl": "1592593775126",
            "tn_w": 177,
            "tn_h": 250,
            "sub": "Great Pretender",
            "teaser": "Masterpiece and clearly AOTY 2020"
        },
        "204715721": {
            "date": 1592636826,
            "file": "273581ddae7785c179eb2714c832e92d.jpg",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204715721
            },
            "b": 125,
            "author": "Anonymous",
            "imgurl": "1592636826776",
            "tn_w": 176,
            "tn_h": 250,
            "sub": "",
            "teaser": "ITT tropes you don&#039;t really hate &gt;the gag character who is exceptionally capable when doing his job"
        },
        "204709406": {
            "date": 1592623164,
            "file": "FMAB.jpg",
            "r": 14,
            "i": 3,
            "lr": {
                "id": 204715702,
                "date": 1592636788,
                "author": "Anonymous"
            },
            "b": 126,
            "author": "Anonymous",
            "imgurl": "1592623164938",
            "tn_w": 178,
            "tn_h": 250,
            "sub": "",
            "teaser": "ITT: Anime that are &quot;Rights of Passage&quot; or staples for otaku"
        },
        "204712774": {
            "date": 1592629472,
            "file": "1592617211493.png",
            "r": 56,
            "i": 18,
            "lr": {
                "id": 204715685,
                "date": 1592636746,
                "author": "Anonymous"
            },
            "b": 127,
            "author": "Anonymous",
            "imgurl": "1592629472228",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Best OP?",
            "teaser": "Can any series beat Monogatari for best OPs? The memes seem to speak for themselves. https:\/\/www.youtube.com\/watch?v=tUJ1YHxqbKA"
        },
        "204708491": {
            "date": 1592621551,
            "file": "Serial_Experiments_Lain-Lain_Iwakura.png",
            "r": 12,
            "i": 4,
            "lr": {
                "id": 204715669,
                "date": 1592636703,
                "author": "Anonymous"
            },
            "b": 128,
            "author": "Anonymous",
            "imgurl": "1592621551256",
            "tn_w": 250,
            "tn_h": 177,
            "sub": "",
            "teaser": "&gt;PASHOOKAY"
        },
        "204715654": {
            "date": 1592636651,
            "file": "DBZ-banner.jpg",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204715654
            },
            "b": 129,
            "author": "Anonymous",
            "imgurl": "1592636651756",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "Still the best Dragonball movie."
        },
        "204713618": {
            "date": 1592631298,
            "file": "5324235dd233d.jpg",
            "r": 2,
            "i": 0,
            "lr": {
                "id": 204715595,
                "date": 1592636450,
                "author": "Anonymous"
            },
            "b": 130,
            "author": "Anonymous",
            "imgurl": "1592631298570",
            "tn_w": 227,
            "tn_h": 250,
            "sub": "",
            "teaser": "A randomer told me to watch Ergo Proxy so i did and i really liked it. It&#039;s the only anime i&#039;ve watched. I want more like it please."
        },
        "204715074": {
            "date": 1592635023,
            "file": "aaaaaa.jpg",
            "r": 10,
            "i": 4,
            "lr": {
                "id": 204715592,
                "date": 1592636438,
                "author": "Anonymous"
            },
            "b": 131,
            "author": "Anonymous",
            "imgurl": "1592635023413",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "why are there so many people loving wan piss despite it&#039;s being utterly childish unintelligent piece of garbage? is humanity at it&#039;s peril?"
        },
        "204714574": {
            "date": 1592633742,
            "file": "1565423846170.png",
            "r": 3,
            "i": 1,
            "lr": {
                "id": 204716025,
                "date": 1592637658,
                "author": "Anonymous"
            },
            "b": 132,
            "author": "Anonymous",
            "imgurl": "1592633742538",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "Darker than Black thread",
            "teaser": "Just finished this anime. I liked it a lot. Is it true the OVA&#039;s\/sequel are bad enough to not be worth watching or should I give them a try?"
        },
        "204710911": {
            "date": 1592626011,
            "file": "DvANZhOV4AIEkDJ.jpg",
            "r": 11,
            "i": 2,
            "lr": {
                "id": 204715567,
                "date": 1592636373,
                "author": "Anonymous"
            },
            "b": 133,
            "author": "Anonymous",
            "imgurl": "1592626011765",
            "tn_w": 176,
            "tn_h": 250,
            "sub": "Anime philosophy",
            "teaser": "I see dr. Stone as an objectivist anime. What are some other philosophy based anime?"
        },
        "204695524": {
            "date": 1592601021,
            "file": "0540-017.png.jpg",
            "r": 61,
            "i": 13,
            "lr": {
                "id": 204715557,
                "date": 1592636325,
                "author": "Anonymous"
            },
            "b": 134,
            "author": "Anonymous",
            "imgurl": "1592601021044",
            "tn_w": 166,
            "tn_h": 250,
            "sub": "",
            "teaser": "This is unironically one of the most soulfully foreshadowed twists in battle shounen."
        },
        "204712965": {
            "date": 1592629887,
            "file": "1566231872502.png",
            "r": 5,
            "i": 0,
            "lr": {
                "id": 204715531,
                "date": 1592636251,
                "author": "Anonymous"
            },
            "b": 135,
            "author": "Anonymous",
            "imgurl": "1592629887553",
            "tn_w": 250,
            "tn_h": 153,
            "sub": "",
            "teaser": "&gt;watch anime, especially romcom &gt;the &quot;best girls&quot; are already 10-15 years younger than you"
        },
        "204686295": {
            "date": 1592586927,
            "file": "file.png",
            "r": 142,
            "i": 37,
            "lr": {
                "id": 204715473,
                "date": 1592636078,
                "author": "Anonymous"
            },
            "b": 136,
            "author": "Anonymous",
            "imgurl": "1592586927469",
            "tn_w": 250,
            "tn_h": 187,
            "sub": "BLAME! and Nihei thread",
            "teaser": "Let us talk... I got the 6 Master Edition volumes for my birthday last month. Just finished reading it all. I think I liked it very much, I&#039;ve never really read anything like it before. I have some questions and I would like to talk about it with you anons Questions from me: Why is the level 9 so important? What I came to understand is that the sphere from the level 9 came to contain an embryo with the Net Terminal gene. Why does a level 9 safeguard have an embryo with the Net Terminal Gene? Is this explained anywhere else? Sanakan mentions that the Embryo is hers and Cibo&#039;s child? Why Sanakan&#039;s as well? Is this maybe not because it is literally Sanakan&#039;s child as well, but because she and Cibo has wandered for so long now that she sees the embryo as her actual child that she wants to protect like a real parent would? Also, where do I go from here? I want to read more of Nihei&#039;s work, which should I look into?"
        },
        "204710655": {
            "date": 1592625552,
            "file": "Haru_park.png",
            "r": 12,
            "i": 4,
            "lr": {
                "id": 204715472,
                "date": 1592636077,
                "author": "Anonymous"
            },
            "b": 137,
            "author": "Anonymous",
            "imgurl": "1592625552339",
            "tn_w": 220,
            "tn_h": 220,
            "sub": "Sing yesterday for me",
            "teaser": "How did 113 chapters take almost 2 decades to do? Also yesterday thread."
        },
        "204696532": {
            "date": 1592602538,
            "file": "thonking.jpg",
            "r": 52,
            "i": 4,
            "lr": {
                "id": 204715457,
                "date": 1592636036,
                "author": "Anonymous"
            },
            "b": 138,
            "author": "Anonymous",
            "imgurl": "1592602538187",
            "tn_w": 250,
            "tn_h": 250,
            "sub": "",
            "teaser": "What makes you drop a show?"
        },
        "204705441": {
            "date": 1592615842,
            "file": "1592492039910.jpg",
            "r": 57,
            "i": 16,
            "lr": {
                "id": 204715410,
                "date": 1592635898,
                "author": "Anonymous"
            },
            "b": 139,
            "author": "Anonymous",
            "imgurl": "1592615842601",
            "tn_w": 177,
            "tn_h": 250,
            "sub": "Evangelion",
            "teaser": "Why did Adam\/Kaworu fall for this 14-year-old cute Nippon boy?"
        },
        "204695344": {
            "date": 1592600736,
            "file": "0599-015.jpg",
            "r": 63,
            "i": 9,
            "lr": {
                "id": 204715296,
                "date": 1592635587,
                "author": "Anonymous"
            },
            "b": 140,
            "author": "Anonymous",
            "imgurl": "1592600736703",
            "tn_w": 250,
            "tn_h": 187,
            "sub": "",
            "teaser": "Was it a good twist?"
        },
        "204705870": {
            "date": 1592616667,
            "file": "2.jpg",
            "r": 301,
            "i": 168,
            "lr": {
                "id": 204715288,
                "date": 1592635566,
                "author": "Anonymous"
            },
            "b": 141,
            "author": "Anonymous",
            "imgurl": "1592616667668",
            "tn_w": 158,
            "tn_h": 250,
            "sub": "Yugami kun ni wa Tomodachi ga Inai Volume 6",
            "teaser": "I&#039;M DUMPING Volume 1: &gt;&gt;204470759 Volume 2: &gt;&gt;204518825 Volume 3: &gt;&gt;204562937 Volume 4: &gt;&gt;204607529 Volume 5: &gt;&gt;204660192 The story so far: Chihiro is a transfer student who can&#039;t make any friends while Yugami is the school&#039;s ace pitcher who&#039;d rather spend his time alone. It&#039;s the Culture Festival and Yugami wants to perform live Rakugo in front of everyone, but now he has to decide whether he&#039;ll do the skit the audience would want or the skit he wants to do! Also, it&#039;s June 20 (from where I&#039;m from), meaning it&#039;s Chihiro&#039;s Birthday! Greet her a happy birthday (or tomorrow at the Volume 7 dump if it&#039;s still June 19 for you)."
        },
        "204712954": {
            "date": 1592629853,
            "file": "part5.jpg",
            "r": 4,
            "i": 0,
            "lr": {
                "id": 204715269,
                "date": 1592635501,
                "author": "Anonymous"
            },
            "b": 142,
            "author": "Anonymous",
            "imgurl": "1592629853972",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "Everytime I close my eyes..."
        },
        "204679192": {
            "date": 1592574787,
            "file": "Ea4N1hLVcAE7W2q.jpg:large.jpg",
            "r": 508,
            "i": 95,
            "lr": {
                "id": 204715574,
                "date": 1592636385,
                "author": "Anonymous"
            },
            "b": 143,
            "bumplimit": 1,
            "author": "Anonymous",
            "imgurl": "1592574787880",
            "tn_w": 187,
            "tn_h": 250,
            "sub": "Raildex",
            "teaser": "Will Junko appear in GT2?"
        },
        "204707649": {
            "date": 1592620014,
            "file": "Dragon_Ball_Z_Dragon_Ball_Android_18_anime_girls-1267215.jpg!d.png",
            "r": 55,
            "i": 29,
            "lr": {
                "id": 204715056,
                "date": 1592634989,
                "author": "Anonymous"
            },
            "b": 144,
            "author": "Anonymous",
            "imgurl": "1592620014891",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "ITT: we post alpha women"
        },
        "204712753": {
            "date": 1592629431,
            "file": "smug.png",
            "r": 9,
            "i": 8,
            "lr": {
                "id": 204714970,
                "date": 1592634749,
                "author": "Anonymous"
            },
            "b": 145,
            "author": "Anonymous",
            "imgurl": "1592629431481",
            "tn_w": 250,
            "tn_h": 227,
            "sub": "ITT: smug",
            "teaser": "Post em"
        },
        "204714798": {
            "date": 1592634324,
            "file": "1591751825931.jpg",
            "r": 5,
            "i": 0,
            "lr": {
                "id": 204715134,
                "date": 1592635143,
                "author": "Anonymous"
            },
            "b": 146,
            "author": "Anonymous",
            "imgurl": "1592634324901",
            "tn_w": 200,
            "tn_h": 203,
            "sub": "",
            "teaser": "Do you take manga seriously or you just read what you like? What&#039;s the point of taking it seriously if you never become a actual mangaka?"
        },
        "204709403": {
            "date": 1592623157,
            "file": "maxresdefault-5.jpg",
            "r": 32,
            "i": 6,
            "lr": {
                "id": 204714921,
                "date": 1592634637,
                "author": "Anonymous"
            },
            "b": 147,
            "author": "Anonymous",
            "imgurl": "1592623157085",
            "tn_w": 250,
            "tn_h": 140,
            "sub": "",
            "teaser": "Why is Gurren Lagann better than EVA"
        },
        "204714908": {
            "date": 1592634611,
            "file": "opm.jpg",
            "r": 0,
            "i": 0,
            "lr": {
                "id": 204714908
            },
            "b": 148,
            "author": "Anonymous",
            "imgurl": "1592634611462",
            "tn_w": 250,
            "tn_h": 155,
            "sub": "OPM",
            "teaser": "Are you hyped for the third season?"
        },
        "204706219": {
            "date": 1592617286,
            "file": "75.jpg",
            "r": 22,
            "i": 9,
            "lr": {
                "id": 204714862,
                "date": 1592634483,
                "author": "Anonymous"
            },
            "b": 149,
            "author": "Anonymous",
            "imgurl": "1592617286075",
            "tn_w": 250,
            "tn_h": 187,
            "sub": "",
            "teaser": "Why isn&#039;t Sanji allowed to be cool anymore?"
        }
    },
    "count": 150,
    "slug": "a",
    "anon": "Anonymous",
    "mtime": 1592640058,
    "pagesize": 15,
    "custom_spoiler": 1
};
var style_group = "ws_style";
var check_for_block = true;
var fourcat = new FC();
fourcat.applyCSS(null, "ws_style", 693);