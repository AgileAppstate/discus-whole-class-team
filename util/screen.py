from tkinter import *
import io
from PIL import ImageTk, Image
import time         # For delay handeling.

# --- SETTINGS --- #
default_border = 10
default_duration = 30

def setup():
  global width, height, canvas, root

  # Set up the fullscreen window.
  root = Tk()
  root.attributes('-fullscreen',True)
  width = root.winfo_screenwidth()
  height = root.winfo_screenheight()

  # Create a fullscreen canvas with a black background.
  canvas = Canvas(root, width = width, height = height)
  canvas.configure(highlightthickness=0)
  canvas.configure(background='black')
  canvas.pack()

def clear():
  canvas.delete("all")

def draw_img(img_file):
  # Open the image.
  img = Image.open(io.BytesIO(img_file))

  # Scale it to fit the screen.
  img_width, img_height = img.size
  scale = min(
    (width - (2 * default_border)) / img_width,
    (height - (2 * default_border)) / img_height
  )
  img_resize = img.resize((int(img_width * scale), int(img_height * scale)))

  # Convert it for TK and return.
  tk_img = ImageTk.PhotoImage(img_resize)

  # Draw the image.
  canvas.create_image(
    width / 2,
    height / 2,
    anchor = CENTER,
    image = tk_img
  )
  root.update()

# Sleep for the assigned duration, or if 0, the default duration.
def sleep(secs):
  time.sleep(secs if secs > 0 else default_duration)