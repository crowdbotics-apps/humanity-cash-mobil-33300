import os
import uuid


def picture_upload_dir(instance, subdir, filename):
    ext = filename.split(".")[-1]
    filename = "%s.%s" % (str(uuid.uuid4()).replace("-", ""), ext)
    return os.path.join(subdir, filename)
