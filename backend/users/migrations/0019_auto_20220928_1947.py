
# Generated by Django 3.2.15 on 2022-09-28 19:47

from django.db import migrations

CREATE_VIEW_SQL = """
CREATE VIEW dwolla_user AS
(

SELECT u.id,
       u.name,
       u.email,
       c.dwolla_id,
       u.last_login,
       u.date_joined,
       c.crypto_wallet_id,
       c.address_1 as address,
       'PERSONAL'  as account_type
FROM users_user u
         JOIN consumer c on u.id = c.user_id
WHERE u.is_active is TRUE

UNION

SELECT u.id,
       u.name,
       u.email,
       m.dwolla_id,
       u.last_login,
       u.date_joined,
       m.crypto_wallet_id,
       m.address_1 as address,
       'BUSINESS'  as account_type

FROM users_user u
         JOIN merchant m on u.id = m.user_id
WHERE u.is_active is TRUE
    )
"""

DROP_VIEW_SQL = """ DROP VIEW dwolla_user"""
class Migration(migrations.Migration):

    dependencies = [
        ('users', '0018_merge_20220912_2254'),
    ]

    operations = [
        migrations.RunSQL(sql=CREATE_VIEW_SQL, reverse_sql=DROP_VIEW_SQL)
    ]
