"""add role to admin_users

Revision ID: c2d3e4f5a6b7
Revises: b1c2d3e4f5a6
Create Date: 2026-07-05

"""
from alembic import op
import sqlalchemy as sa

revision = 'c2d3e4f5a6b7'
down_revision = 'b1c2d3e4f5a6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('admin_users', sa.Column('role', sa.String(50), nullable=False, server_default='admin'))


def downgrade() -> None:
    op.drop_column('admin_users', 'role')
