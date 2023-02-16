import os
import uuid


def picture_upload_dir(instance, subdir, filename):
    ext = filename.split(".")[-1]
    filename = "%s.%s" % (str(uuid.uuid4()).replace("-", ""), ext)
    return os.path.join(subdir, filename)


flat_map = lambda f, xs: (y for ys in xs for y in f(ys))
