from fastapi import APIRouter, status
from app.models.healthcheck import HealthcheckResponse

router = APIRouter()


@router.get(
        path="/check",
        name="healthcheck",
        description=(
            "Healthcheck endpoint to check the status of the service and "
            "restart the service if needed."
        ),
        response_description="The status of the service.",
        status_code=status.HTTP_200_OK,
        response_model=HealthcheckResponse)
def healthcheck():
    """
    - Healthcheck endpoint.
    - Returns the status of the service.
    - Docker uses this endpoint to check the status of the service
    and restart the service if needed.
    """
    healthcheck_response = HealthcheckResponse(status="ok")
    return healthcheck_response
