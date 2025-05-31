# In ai_pills_fastapi_backend/app/tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from app.main import app # Your main FastAPI application

# This import is for direct manipulation of the in-memory DB for test setup.
# In a real scenario with a database, this would involve database sessions,
# transaction rollbacks, or test database utilities.
from app.api.endpoints.agents import fake_agents_db
from app.models.agent_models import AgentInDBBase # For creating agent instances
from datetime import datetime, timezone

@pytest.fixture(scope="function")
def client():
    """
    Provides a TestClient instance for making requests to the FastAPI application.
    This client allows testing the application without running a live server.
    Scope is 'function' to ensure a clean client for each test.
    """
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def approved_agent_fixture():
    """
    A pytest fixture that sets up the in-memory 'fake_agents_db' with a single,
    'approved' AI agent before a test runs, and cleans up afterwards.

    Yields:
        dict: The data of the created 'approved' agent.
    """
    original_db_state = dict(fake_agents_db) # Save current state if any
    fake_agents_db.clear() # Ensure a clean slate for this specific test's scope

    agent_id = 123 # Example ID for the test agent
    agent_data = {
        "id": agent_id,
        "name": "Fixture Approved Agent",
        "developer_username": "fixture_dev",
        "status": "approved",
        "version": "1.0",
        "upload_date": datetime.now(timezone.utc), # Use timezone-aware datetime
        "description": "An agent created by a fixture specifically for testing approved scenarios.",
        "tags": ["fixture", "approved_tag"],
        "github_link": "http://example.com/fixture/approved"
    }

    # Create an instance of the Pydantic model to store in fake_agents_db
    # This ensures the data stored matches the application's expectations.
    try: # Pydantic v2
        agent_instance = AgentInDBBase.model_validate(agent_data)
    except AttributeError: # Pydantic v1
        agent_instance = AgentInDBBase(**agent_data)

    fake_agents_db[agent_id] = agent_instance

    yield agent_data # Provide the raw data for assertions in the test

    # Teardown: Restore original DB state or simply clear for next test
    fake_agents_db.clear()
    fake_agents_db.update(original_db_state) # Restore to how it was before this fixture ran

@pytest.fixture(scope="function")
def pending_agent_fixture():
    """
    A pytest fixture that sets up the in-memory 'fake_agents_db' with a single,
    'pending_review' AI agent before a test runs, and cleans up afterwards.

    Yields:
        dict: The data of the created 'pending_review' agent.
    """
    original_db_state = dict(fake_agents_db)
    fake_agents_db.clear()

    agent_id = 456 # Example ID for this test agent
    agent_data = {
        "id": agent_id,
        "name": "Fixture Pending Agent",
        "developer_username": "fixture_user_pending",
        "status": "pending_review",
        "version": "0.9",
        "upload_date": datetime.now(timezone.utc),
        "description": "An agent from a fixture, status is pending review.",
        "tags": ["fixture", "pending_tag"],
        "github_link": "http://example.com/fixture/pending"
    }

    try: # Pydantic v2
        agent_instance = AgentInDBBase.model_validate(agent_data)
    except AttributeError: # Pydantic v1
        agent_instance = AgentInDBBase(**agent_data)

    fake_agents_db[agent_id] = agent_instance

    yield agent_data

    # Teardown
    fake_agents_db.clear()
    fake_agents_db.update(original_db_state)

# Note on fixture scope:
# 'function' scope means the fixture runs once per test function. This is good for isolation.
# If setting up the DB was expensive, 'module' or 'session' scope might be used,
# but then careful management of data changes by tests would be needed to avoid interference.
# For an in-memory dict like fake_agents_db, 'function' scope with clear/restore is fine.
