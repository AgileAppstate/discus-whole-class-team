### STL imports ###
import sys
import os
import json
import typing
from datetime import datetime 
import datetime as dt
import pymongo
import cmd

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
import discus.api.views as views

def _on_finished(ctx):
    click.echo(f'Exiting DISCUS.')

@shell(prompt='discus > ', 
       intro='Welcome to the Digital Signage Control System!',
       on_finished=_on_finished)
def main():
    pass

@main.group()
@click.pass_context
def image(ctx: click.Context):
    pass

@image.command()
@click.pass_context
@click.argument('path', required=True)
@click.option('--duration', '-d', default=0, help='How long the image will stay on screen when being displayed')
@click.option('--start_date', '-s', default=None, help='First date image will be in rotation')
@click.option('--end_date', '-e', default=None, help='Date on which the image will be taken out of rotation')
def insert(ctx: click.Context, 
           path: str = None, 
           start_date: datetime = datetime.now(), 
           duration: float = 15., 
           end_date: datetime = datetime.datetime(dt.MAXYEAR, 1, 1, 0, 0, 0)) -> bool:
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

def resolve(hint):
    if isinstance(hint, str):
        try: 
            return images.get_id_by_name(hint)
        except AttributeError as e:
            return None

    elif isinstance(hint, int):
        return hint

    else:
        return None

def resolve_and_do(hint, do, **params):
    click.echo(params)
    if id := resolve(hint) or not params['strict']:
        do(id, params)
    else:
        click.echo(f"Could not find record from hint [{hint}]")


def _get(id, _):
    fetched_images = None
    if id:
        fetched_images = images.image_get_by_id(id)
    else:
        fetched_images = images.image_get_all()
    
    if not id:
        click.echo(f"No images found in database.")   
        sys.exit(0)
    elif not fetched_images:
        click.echo(f"No image with id or name {id} found. Better luck next time.")
        sys.exit(0)

    # TODO: Make sure it's properly formatted data
    formatted_json = views.cursor_to_json(fetched_images) 
    colorful_json = highlight(
        formatted_json, lexers.JsonLexer(), formatters.TerminalFormatter())
    click.echo(colorful_json)


@image.command()
@click.argument('hint', required=False, default=None)
def get(hint = None) -> None:
    resolve_and_do(hint, _get, strict=False)

def _delete(id, _) -> None:
    result: pymongo.results.DeleteResult = image.image_delete(id)
    if result.deleted_count == 0:
        click.echo(f"No documents matching {id} found to delete.")

@image.command()
@click.argument('hint', required=True)
def delete(hint) -> None:
   resolve_and_do(hint, _delete, strict=True) 

def _set_duration(id, value):
    return image.image_set_duration(id, value)  

def _set_end_date(id, value):
    return image.image_set_end_date(id, value)

def _set_start_date(id, value):
    return image.image_set_start_date(id, value)

def _set_description(id, value):
    return image.set_description(id, value)

_set_dispatch_map = {
        'duration': _set_duration,
        'description': _set_description,
        'end_date': _set_end_date,
        'start_date': _set_start_date 
}

def _set(id: int, params: dict) -> None:
    result = set_dispatch_map[params['field']](id, params['value'])    
    if result.matched_count == 0:
        click.echo(f"No image with id {id}. No changes made.") 

@image.command()
@click.argument("hint", required=True)
@click.argument("field", required=True)
@click.argument("value", required=True)
def set(hint, value):
    resolve_and_do(hint, _set, value=value, field=field, strict=True)

### Quitting

quit_words = {'quit', 'exit'}
main.shell.precmd = lambda l: l 
main.shell.onecmd = lambda l: l 
main.shell.postcmd = lambda _, l: l in quit_words
