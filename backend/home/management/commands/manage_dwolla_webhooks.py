import json
import subprocess

import django
from django.core.management.base import BaseCommand
from munch import munchify

from home.clients.dwolla_api import DwollaClient


class Command(BaseCommand):
    help = "Generate a json with all Models and URLs of the project."
    def add_arguments(self, parser):
        parser.add_argument(
            '--url', dest='url', default=None,
            help='Specifies the url for the subscription to be created.',
        )

        parser.add_argument(
            '--secret', dest='secret', default=None,
            help='Specifies the secret for the subscription to be created.',
        )

        parser.add_argument(
            '--id', dest='id', default=None,
            help='Specifies the id for the subscription to be managed.',
        )

        parser.add_argument('-p', '--pause', dest='pause', action='store_true')  # on/off flag
        parser.add_argument('-u', '--unpause', dest='unpause', action='store_true')  # on/off flag
        parser.add_argument('-a', '--add', dest='add', action='store_true')  # on/off flag
        parser.add_argument('-d', '--delete', dest='delete', action='store_true')  # on/off flag
        parser.add_argument('-l', '--list', dest='list', action='store_true')  # on/off flag

    def list_webhooks(self, client):
        for wh in client.get_subscriptions():
            wh = munchify(wh)
            print(f'ID: {wh.id} \t PAUSED: {wh.paused} \t URL: {wh.url}')

    def handle(self, *args, **options):
        client = DwollaClient()
        options = munchify(options)

        if options.list:
            self.list_webhooks(client)
            return

        if options.add:
            if options.url is None or options.secret is None:
                print('url and secret is required to add a webhook')
                return
            client.subscribe_webhook(options.url, options.secret)
            self.list_webhooks(client)
            return

        if options.id is None:
            print('id is required to manage a subscription')
            return

        if options.delete:
            print(client.delete_webhook(options.id))

        if options.pause:
            client.pause_unpause_webhook(options.id, pause=True)

        if options.unpause:
            client.pause_unpause_webhook(options.id, pause=False)

        self.list_webhooks(client)