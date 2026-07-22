"""add password_hash to companies

Revision ID: a3f9c1b2d4e5
Revises: 1db6494d1a8e
Create Date: 2026-07-03 15:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = 'a3f9c1b2d4e5'
down_revision: Union[str, None] = '1db6494d1a8e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('companies', sa.Column('password_hash', sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column('companies', 'password_hash')
