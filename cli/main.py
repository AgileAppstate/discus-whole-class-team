from lib import *



group = click.Group()
with click.Context(group) as ctx:
  '''
  Here is where we can initialize any connections or other resources we might need w/in the shell. For example, see below.
  Also, 'obj' is just the name for whatever resource the user has currently loaded.
  '''

  ctx.obj = StringIO('hello')
  @click.command()
  @click.option('--what')
  @click.pass_context
  def echo(ctx, what):
    click.echo(what)
    click.echo(ctx.obj.read())

  shell = make_click_shell(ctx, prompt='discus > ', intro='Welcome to the Digital Signage Control System!')

  shell.add_command(echo, 'echo')
  shell.cmdloop()

