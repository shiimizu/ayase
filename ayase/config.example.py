DEBUG = True

##############
## Database ##
##############

database = {
    'default': 'mysql',
    'mysql': {
        'host': '127.0.0.1',
        'port': 3306,
        'db': 'asagi',
        'schema': 'asagi',
        'user': 'asagi',
        'password': 'asagi',
        'charset': 'utf8mb4'
    },
    'postgresql': {
        'host': '127.0.0.1',
        'port': 5432,
        'db': 'asagi',
        'schema': 'asagi',
        'user': 'asagi',
        'password': 'asagi',
        'charset': 'utf8'
    }
}

####################
## Board Listings ##
####################

archives = [
    {'shortname': 'a', 'name': 'Anime & Manga'},
    {'shortname': 'aco', 'name': 'Adult Cartoons'},
    {'shortname': 'an', 'name': 'Animals & Nature'},
    {'shortname': 'c', 'name': 'Cute'},
    {'shortname': 'co', 'name': 'Comics & Cartoons'},
    {'shortname': 'd', 'name': 'Hentai/Alternative'},
    {'shortname': 'fit', 'name': 'Fitness'},
    {'shortname': 'his', 'name': 'History & Humanities'},
    {'shortname': 'int', 'name': 'International'},
    {'shortname': 'k', 'name': 'Weapons'},
    {'shortname': 'm', 'name': 'Mecha'},
    {'shortname': 'mlp', 'name': 'Pony'},
    {'shortname': 'q', 'name': '4chan Feedback'},
    {'shortname': 'qa', 'name': 'Question & Answer'},
    {'shortname': 'r9k', 'name': 'ROBOT9001'},
    {'shortname': 'tg', 'name': 'Traditional Games'},
    {'shortname': 'trash', 'name': 'Off-Topic'},
    {'shortname': 'vr', 'name': 'Retro Games'},
    {'shortname': 'wsg', 'name': 'Worksafe GIF'}
]

boards = [
    {'shortname': 'p', 'name': 'Photography'}
]

#############
## General ##
#############

SITE_NAME = 'MyArchive'

default_skin = 'default'

skins = [
    {'slug': 'default', 'name': 'FoolFuuka - Default'},
    {'slug': 'midnight', 'name': 'FoolFuuka - Midnight'},
    {'slug': 'kurimasu', 'name': 'FoolFuuka - Christmas'},
    {'slug': 'barentain', 'name': "FoolFuuka - Valentine's Day"},
    {'slug': 'halloween', 'name': 'FoolFuuka - Halloween'}
]

options = {'post_selector': True, 'stats': False, 'ghost': False}

image_location = {
    'image': '/img/{board_name}/image',
    'thumb': '/img/{board_name}/thumb'
}

# Scraper information. This affects templates, not database stuff.
scraper = {
    'default': 'asagi',
    'asagi': {'name': 'Asagi', 'source': 'https://github.com/eksopl/asagi'},
    'ena': {'name': 'Ena', 'source': 'https://github.com/shiimizu/ena'}
}
