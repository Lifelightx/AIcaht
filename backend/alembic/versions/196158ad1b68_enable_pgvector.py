from alembic import op


revision = "196158ad1b68"
down_revision = "dd29319184a9"
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        "CREATE EXTENSION IF NOT EXISTS vector"
    )


def downgrade():
    op.execute(
        "DROP EXTENSION IF EXISTS vector"
    )