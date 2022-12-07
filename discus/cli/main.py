### STL imports ###
import sys
import os
import json
from datetime import date 

### Pygments imports ###
from pygments import highlight, lexers, formatters

### Click imports ###
import click
from click_shell import shell, make_click_shell

### Module imports ###
import discus.util.playlists as playlists
import discus.util.channels as channels
import discus.util.images as images
import discus.api.views as views

def pull_out_object_ids(doc):
    for k, v in doc.items():
        if type(v) == ObjectId:
            doc[k] = v.binary.decode('utf-8')


@shell(prompt='discus > ', 
       intro='Welcome to the Digital Signage Control System!')
def main():
    pass

@main.group()
@click.pass_context
def image(ctx: click.Context):
    pass

@image.command()
@click.pass_context
@click.argument('path', required=True)
@click.option('--duration', default=0, help='How long the image will stay on screen when being displayed')
@click.option('--start_date', default=None, help='First date image will be in rotation')
@click.option('--end_date', default=None, help='Date on which the image will be taken out of rotation')
def insert(ctx: click.Context, 
           path: str = None, 
           start_date: date = date.today(), 
           duration: float = 15., 
           end_date: date = None) -> bool:
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


@image.command()
@click.argument('id', required=False, default=None, help='The id of the image to get. If not included, fetches all images.')
def get(id=None) -> bool:
    fetched_images = None
    if id:
        fetched_images = images.image_get_by_id(id)
    else:
        fetched_images = images.image_get_all()

    ctr = 0
    if not fetched_images:
        click.echo(f"No image with id {id} found. Better luck next time.")
        return False
    # TODO: Make sure it's properly formatted data
    formatted_json = views.cursor_to_json(fetched_images) 
    colorful_json = highlight(
        formatted_json, lexers.JsonLexer(), formatters.TerminalFormatter())
    print(colorful_json)

    return True
