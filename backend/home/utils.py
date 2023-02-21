import os
import uuid
import functools

from rest_framework.exceptions import ValidationError


def picture_upload_dir(instance, subdir, filename):
    ext = filename.split(".")[-1]
    filename = "%s.%s" % (str(uuid.uuid4()).replace("-", ""), ext)
    return os.path.join(subdir, filename)


flat_map = lambda f, xs: (y for ys in xs for y in f(ys))


def may_fail(cls_exc, detail, wrapper_exc=ValidationError, *args_outer, **kwargs_outer):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except cls_exc as exc:
                raise wrapper_exc(detail=detail, *args_outer, **kwargs_outer)

        return wrapper

    return decorator
