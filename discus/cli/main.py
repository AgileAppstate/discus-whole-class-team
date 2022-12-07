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



'''
with click.Context(group) as ctx:

    Here is where we can initialize any connections or other resources we might need w/in the shell. For example, see below.
    Also, 'obj' is just the name for whatever resource the user has currently loaded.

    @click.command()
    @click.argument('what', required=True)
    def echo(what):
        click.echo(what)

    @click.group()
    @click.pass_context
    def image():
        pass

    @click.group()
    @click.pass_context
    def playlist():
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

  This gets an image by id. If no id is provided, all images are returned.
  In either case, if persist is true, then it seaves

    @image.command()
    @click.option('--id', required=False, default=None)
    @click.option('--persist', '-p', is_flag=True, default=False, help='Whether or not to persist fetched documents to disk.')
    @click.option('--output', '-o', default='discus_results.json', help='Filepath of saved results. Ignored if persist is false.')
    @click.option('--dir', '-d', default=os.getcwd(), help='Directory where results file will be saved. Ignored if persist is false.')
    def get(id, persist, output, dir):
        fetched_images = None
        if id:
            fetched_images
        else:
            fetched_images = images.image_get_all()

        ctr = 0
        if not persist:
            for doc in fetched_images:
                formatted_json = json.dumps(doc, indent=4)
                colorful_json = highlight(
                    formatted_json, lexers.JsonLexer(), formatters.TerminalFormatter())
                print(colorful_json)
                ctr += 1
            # for doc in fetched_images

            if ctr == 0:
                if id:
                    print(f'No images with id {id} found.')
                else:
                    print(f'No images found, no id provided.')
            return 0
            # if ctr == 0
        # if not persist

        else:
            with open(os.path.join(dir, output), 'w+') as f:
                for doc in fetched_images:
                    doc = json.loads(doc)
                    pull_out_object_ids(doc)
                    f.write(json.dumps(doc))
            # with open(os...
        # else

        return 0
    # def get

    shell = make_click_shell(
        ctx, prompt='discus > ', intro='Welcome to the Digital Signage Control System!')
    shell.add_command(image, 'image')
    image.add_command(insert)
    shell.add_command(echo, 'echo')
    shell.cmdloop()
'''
