"""initial

Revision ID: 0001_initial
Revises:
Create Date: 2026-07-22

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = '0001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'companies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('website', sa.String(length=500), nullable=True),
        sa.Column('industry', sa.String(length=255), nullable=True),
        sa.Column('address_street', sa.String(length=500), nullable=True),
        sa.Column('address_number', sa.String(length=20), nullable=True),
        sa.Column('address_complement', sa.String(length=255), nullable=True),
        sa.Column('address_district', sa.String(length=255), nullable=True),
        sa.Column('address_city', sa.String(length=255), nullable=True),
        sa.Column('address_state', sa.String(length=100), nullable=True),
        sa.Column('address_country', sa.String(length=100), nullable=True),
        sa.Column('address_zip', sa.String(length=20), nullable=True),
        sa.Column('linkedin_url', sa.String(length=500), nullable=True),
        sa.Column('instagram_url', sa.String(length=500), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('founding_year', sa.Integer(), nullable=True),
        sa.Column('employee_count', sa.String(length=50), nullable=True),
        sa.Column('logo_url', sa.String(length=1000), nullable=True),
        sa.Column('banner_url', sa.String(length=1000), nullable=True),
        sa.Column('password_hash', sa.String(length=255), nullable=True),
        sa.Column('status', sa.Enum('pending', 'active', 'suspended', name='companystatus'), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_companies_id', 'companies', ['id'])
    op.create_index('ix_companies_slug', 'companies', ['slug'], unique=True)
    op.create_index('ix_companies_email', 'companies', ['email'], unique=True)
    op.create_index('ix_companies_industry', 'companies', ['industry'])
    op.create_index('ix_companies_address_city', 'companies', ['address_city'])
    op.create_index('ix_companies_address_country', 'companies', ['address_country'])

    op.create_table(
        'company_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('history', sa.Text(), nullable=True),
        sa.Column('certifications', sa.JSON(), nullable=False, server_default='[]'),
        sa.Column('networks', sa.JSON(), nullable=False, server_default='[]'),
        sa.Column('tags', sa.JSON(), nullable=False, server_default='[]'),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('company_id'),
    )

    op.create_table(
        'subscriptions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('plan_type', sa.Enum('pro', 'business', name='plantype'), nullable=False),
        sa.Column('status', sa.Enum('active', 'cancelled', 'past_due', 'trialing', name='subscriptionstatus'), nullable=False),
        sa.Column('stripe_customer_id', sa.String(length=255), nullable=True),
        sa.Column('stripe_subscription_id', sa.String(length=255), nullable=True),
        sa.Column('current_period_end', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('company_id'),
    )
    op.create_index('ix_subscriptions_stripe_customer_id', 'subscriptions', ['stripe_customer_id'])
    op.create_index('ix_subscriptions_stripe_subscription_id', 'subscriptions', ['stripe_subscription_id'], unique=True)

    op.create_table(
        'quotes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('buyer_company_id', sa.Integer(), nullable=False),
        sa.Column('supplier_company_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('cargo_details', sa.Text(), nullable=True),
        sa.Column('origin', sa.String(length=255), nullable=True),
        sa.Column('destination', sa.String(length=255), nullable=True),
        sa.Column('status', sa.Enum('sent', 'viewed', 'replied', 'closed', name='quotestatus'), nullable=False, server_default='sent'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['buyer_company_id'], ['companies.id']),
        sa.ForeignKeyConstraint(['supplier_company_id'], ['companies.id']),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table(
        'admin_users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='admin'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email', name='uq_admin_users_email'),
    )
    op.create_index('ix_admin_users_email', 'admin_users', ['email'])

    op.create_table(
        'company_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('event_type', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_company_events_company_id', 'company_events', ['company_id'])
    op.create_index('ix_company_events_created_at', 'company_events', ['created_at'])


def downgrade() -> None:
    op.drop_table('company_events')
    op.drop_table('admin_users')
    op.drop_table('quotes')
    op.drop_index('ix_subscriptions_stripe_subscription_id', table_name='subscriptions')
    op.drop_index('ix_subscriptions_stripe_customer_id', table_name='subscriptions')
    op.drop_table('subscriptions')
    op.drop_table('company_profiles')
    op.drop_index('ix_companies_address_country', table_name='companies')
    op.drop_index('ix_companies_address_city', table_name='companies')
    op.drop_index('ix_companies_industry', table_name='companies')
    op.drop_index('ix_companies_email', table_name='companies')
    op.drop_index('ix_companies_slug', table_name='companies')
    op.drop_index('ix_companies_id', table_name='companies')
    op.drop_table('companies')
    op.execute('DROP TYPE IF EXISTS companystatus')
    op.execute('DROP TYPE IF EXISTS plantype')
    op.execute('DROP TYPE IF EXISTS subscriptionstatus')
    op.execute('DROP TYPE IF EXISTS quotestatus')
