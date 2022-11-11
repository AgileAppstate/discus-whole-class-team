from lib import *

ctx = {}

@click.command()
@click.option('--what')
def echo(what):
  click.echo(what)

group = click.Group()
ctx = click.Context(group)
shell = make_click_shell(ctx, prompt='discus > ', intro='Welcome to the Digital Signage Control System!')

shell.add_command(echo, 'echo')
shell.cmdloop()

if __name__ == '__main__':
  discus()
