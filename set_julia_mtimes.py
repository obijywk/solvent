import os
import struct

def process_ji(ji_path):
  f = open(ji_path, "rb")

  def readstr():
    s = ""
    while True:
      b = f.read(1)[0]
      if b == 0:
        break
      s += chr(b)
    return s

  JI_MAGIC = bytes("\xfbjli\r\n\x1a\n", "latin-1")
  magic = f.read(len(JI_MAGIC))
  if magic != JI_MAGIC:
    raise Exception("Bad magic: {}".format(magic))

  ji_format_version = struct.unpack("!H", f.read(2))[0]
  if ji_format_version != 3:
    raise Exception("Bad version: {}".format(ji_format_version))

  bom = f.read(2)
  if bom != bytes("\xff\xfe", "latin-1"):
    raise Exception("Bad byte order marker: {}".format(bom))

  pointer_size = struct.unpack("B", f.read(1))[0]
  if pointer_size != 8:
    raise Exception("Unexpected pointer size: {}".format(pointer_size))

  build_uname = readstr()
  build_arch = readstr()
  version_string = readstr()
  git_branch = readstr()
  git_commit = readstr()

  while True:
    n = struct.unpack("!I", f.read(4))[0]
    if n == 0:
      break
    sym = f.read(n)
    uuid = struct.unpack("!Q", f.read(8))[0]

  files_bytes = struct.unpack("!q", f.read(8))[0]
  while True:
    n = struct.unpack("!I", f.read(4))[0]
    if n == 0:
      break
    filepath = f.read(n).decode("ascii")
    mtime = int(struct.unpack("!d", f.read(8))[0])
    print("Updating", filepath, "mtime to", mtime)
    os.utime(filepath, (mtime, mtime))

JULIA_LIB_PATH = "/root/.julia/lib/v0.5"

for filename in os.listdir(JULIA_LIB_PATH):
  ji_path = os.path.join(JULIA_LIB_PATH, filename)
  process_ji(ji_path)
