### STL imports ###
import sys
import os
import json
import typing
from datetime import datetime 
import datetime as dt
import pymongo
from typing import Any, Callable

### Pygments imports ###
from pygments import highlight, lexers, formatters

### Click imports ###
import click
from click_shell import shell, make_click_shell

### Pymongo imports ### 
import pymongo

### Module imports ###
import discus.util.playlists as playlists
import discus.util.channels as channels
import discus.util.images as images
import discus.util.db as db 
import discus.api.views as views


### Global shell 
###
###

def _on_finished(ctx):
    db.close()
    click.echo(f'Exiting DISCUS.')

@shell(prompt='discus > ', 
       intro='Welcome to the Digital Signage Control System!',
       on_finished=_on_finished)
def main():
    pass

@main.command()
@click.argument("what")
def echo(what):
    click.echo(what)

### Channel commands
### 
###

@main.group()
@click.pass_context
def channel(ctx: click.Context):
    pass

def _get_channel(id: int, _: dict) -> None:
    _get(id,
         _,
         collection='channels')

@channel.command()
@click.pass_context
@click.argument("hint", required=False, default=None)
def get(ctx, hint: str = None) -> None:
    resolve_and_do(hint, 
                   _get_channel, 
                   collection='channels',
                   strict=False)
@channel.command()
@click.argument("hint", required=True, type=str)
@click.argument("field", required=True, type=str)
@click.argument("value", required=True) # Can't type annotate Any because Click-Shell will try to instantiate any instance of it
def set(hint: str | int, field: str, value: Any) -> None:
    resolve_and_do(hint, 
                   _set_channel, 
                   collction='channels',
                   value=value, 
                   field=field, 
                   strict=True)

def _set_channel(id: int, params: dict) -> None:
    _set(id,
         params,
         collection='channels')

def _channel_set_mode(id, mode):
    return channels.channel_set_mode(id, mode)

def _channel_set_playlist(id, playlist):
    return channels.channel_set_playlist(id, playlist)

def _channel_set_start_date(id, start_date):
    return channels.channel_set_start_date(id, start_date)

def _channel_set_end_date(id, end_date):
    return channels.channel_set_end_date(id, end_date)

### Playlist commands
### 
### 

@main.group()
@click.pass_context
def playlist(ctx: click.Context):
    pass

@playlist.command()
@click.pass_context
@click.argument("name", type=str, required=True)
@click.option('--shuffle', '-s', default=False, help="Sets playlist to shuffle.")
@click.argument('items', default=str, required=False)
def insert(
        ctx,
        name: str,
        shuffle: bool,
        items: str 
        ) -> None:
    try: 
        items = json.loads(items)
    except json.JSONDecodeError:
        click.echo('Malformed items list.')
        sys.exit(1)

    playlists.playlist_insert(
        playlistname=name,
        shuffle=shuffle,
        itemList=items
    )


def _get_playlist(id: int, _) -> None:
    _get(id,
         _,
         collection='playlists')
    
@playlist.command()
@click.pass_context
@click.argument("hint", required=False, default=None)
def get(ctx, hint: str = None) -> None:
    resolve_and_do(hint, 
                   _get_playlist, 
                   collection='playlists',
                   strict=False)

def _playlist_set_name(id, name):
    return playlists.playlist_set_name(id, name)

def _playlist_set_shuffle(id, shuffle):
    return playlist.playlist_set_shuffle(id, shuffle) 

def _set_playlist(id: int, params: dict) -> None:
    _set(id,
         params,
         collection='playlists')

@playlist.command()
@click.argument("hint", required=True, type=str)
@click.argument("field", required=True, type=str)
@click.argument("value", required=True) # Can't type annotate Any because Click-Shell will try to instantiate any instance of it
def set(hint: str | int, field: str, value: Any) -> None:
    resolve_and_do(hint, 
                   _set_playlist, 
                   collection='playlists',
                   value=value, 
                   field=field, 
                   strict=True)

def _delete_playlist(id, _) -> None:
    result: pymongo.results.DeleteResult = playlists.playlist_delete(id)
    if result.deleted_count == 0:
        click.echo(f"No documents matching {id} found to delete.")

@playlist.command()
@click.argument('hint', required=True)
def delete(hint) -> None:
   resolve_and_do(hint, 
                  _delete_playlist, 
                  collection='playlists',
                  strict=True) 

### Image group
### 
### 

@main.group()
@click.pass_context
def image(ctx: click.Context):
    pass

@image.command()
@click.pass_context
@click.argument('path', required=True)
@click.option('--duration', '-d', default=0, type=float, help='How long the image will stay on screen when being displayed')
@click.option('--start_date', '-s', default=None, help='First date image will be in rotation')
@click.option('--end_date', '-e', default=None, help='Date on which the image will be taken out of rotation')
def insert(ctx: click.Context, 
           path: str = None, 
           start_date: datetime = datetime.now(), 
           duration: float = 15., 
           end_date: datetime = datetime(dt.MAXYEAR, 1, 1, 0, 0, 0)) -> bool:
    try:
        images.image_insert(
            path=path,
            duration=duration,
            start_date=start_date,
            end_date=end_date
        )
    #TODO: The FileNotFoundError should be caught int he actual API
    except FileNotFoundError as e:
        click.echo(f'No file found at path {path}.')
        return False
    return True

def _get_image(id, _):
    _get(id,
         _,
         collection='images')

@image.command()
@click.argument('hint', required=False, default=None, type=str)
def get(hint: str | None = None) -> None:
    resolve_and_do(hint, 
                   _get_image, 
                   collection='images', 
                   strict=False)

def _delete_image(id, _) -> None:
    result: pymongo.results.DeleteResult = image.image_delete(id)
    if result.deleted_count == 0:
        click.echo(f"No documents matching {id} found to delete.")

@image.command()
@click.argument('hint', required=True)
def delete(hint) -> None:
   resolve_and_do(hint, 
                  _delete_image, 
                  collection='images', 
                  strict=True) 

def _set_image_duration(id, value):
    return images.image_set_duration(id, value)  

def _set_image_end_date(id, value):
    return images.image_set_end_date(id, value)

def _set_image_start_date(id, value):
    return images.image_set_start_date(id, value)

def _set_image_description(id, value):
    return images.set_description(id, value)

def _set_image(id: int, params: dict) -> None:
    _set(id,
         params,
         collection='images')

@image.command()
@click.argument("hint", required=True)
@click.argument("field", required=True, type=str)
@click.argument("value", required=True) # Can't type annotate Any because Click-Shell will try to instantiate any instance of it
def set(hint: str | int, field: str, value: Any) -> None:
    resolve_and_do(hint, 
                   _set_image, 
                   collection='images',
                   value=value, 
                   field=field, 
                   strict=True)

### Hint resolution functions
###
###

_resolve_collections_dispatch_map = {
        'images': images.image_get_id_by_name,
        'playlists': playlists.playlist_get_id_by_name,
        'channels': channels.channel_get_id_by_name
}


def resolve(hint: str, collection: str) -> int | None:
    if hint is None or hint.isdigit():
        return hint
    else:
        try: 
            return _resolve_collections_dispatch_map[collection](hint)
        except AttributeError:
            return None

def resolve_and_do(hint: str | int, 
                   do: Callable, 
                   **params) -> None:
    id = resolve(hint, params['collection'])
    if id or not params['strict']:
        do(id, params)
    else:
        click.echo(f"Could not find record from hint [{hint}]")


### Get abstraction function
###
###

_get_id_collection_map = {
    'channels': channels.channel_get_by_id,
    'playlists': playlists.playlist_get_by_id,
    'images': images.image_get_by_id
}

_get_all_collection_map = {
    'channels': channels.channel_get_all,
    'playlists': playlists.playlist_get_all,
    'images': images.image_get_all
}

def _get(
        id: int,
        _: dict, # Unused params,
        collection=None # This is never exposed, so safe not to catch errors
        ) -> None:
    fetched = None
    if id:
        fetched = _get_id_collection_map[collection](id)
    else:
        fetched = _get_all_collection_map[collection]()

    if not fetched and id:
        click.echo(f"No {collection} with or name {id}. Better luck next time.")
    elif not fetched:
        click.echo(f"No {collection} found in database")
        sys.exit()    

    formatted_json = views.cursor_to_json(fetched) 
    colorful_json = highlight(
        formatted_json, lexers.JsonLexer(), formatters.TerminalFormatter())
    click.echo(colorful_json)

### Set abstraction function
###
###

_set_image_dispatch_map = {
    'duration': _set_image_duration,
    'description': _set_image_description,
    'end_date': _set_image_end_date,
    'start_date': _set_image_start_date 
}

_set_playlist_dispatch_map = {
    'shuffle': _playlist_set_shuffle,
    'name': _playlist_set_name
}

_set_channel_dispatch_map = {
    'start_date': _channel_set_start_date,
    'end_date': _channel_set_end_date,
    'mode': _channel_set_mode,
    'playlist': _channel_set_playlist,
}

_set_collection_dispatch_map_map = {
    'collection': _set_image_dispatch_map,
    'images': _set_image_dispatch_map,
    'channels': _set_channel_dispatch_map
}

def _set(id: int, params: dict, collection: str) -> None:
    field = params['field']
    if field not in _set_collection_dispatch_map_map[collection]:
        click.echo(f'"{field}" is not a field of {collection}.')
        sys.exit(0)

    result = _set_collection_dispatch_map_map[collection][field](id, params['value'])    
    if result.matched_count == 0:
        click.echo(f"No {collection} with id {id}. No changes made.") 

### Quitting
### This tells the underlying ClickShellCmd instance how to process a command
### The source code does not implement these, so they're safe to override

quit_words = {'quit', 'exit'}
main.shell.postcmd = lambda _, l: l in quit_words
