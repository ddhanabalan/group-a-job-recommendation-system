from fastapi import APIRouter, Depends, HTTPException, status, Header

from .. import (
    get_db,
    get_current_user,
    seekerschema,
    seekermodel,
    crud,
    Session,
    check_authorization,
)


router = APIRouter(prefix="/certificate")


@router.get("/")
async def user_seeker_certificate(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    user_certificate = crud.certificate.get_all(db=db, user_id=user_id)
    return user_certificate


@router.get("/{certificate_id}", response_model=seekerschema.SeekersCertificate)
async def get_seeker_certificate(
    certificate_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    await check_authorization(authorization=authorization)
    user_certificate = crud.certificate.get(db=db, certificate_id=certificate_id)
    return user_certificate


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_seeker_certificate(
    certificate: seekerschema.SeekersCertificate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    user = await get_current_user(authorization)
    user_id = user.get("user_id")
    certificate.user_id = user_id
    created_certificate = crud.certificate.create(db, certificate)
    if not created_certificate:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create  certificate details",
        )
    return {"detail": "Certificate details created successfully"}


@router.delete("/{certificate_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_certificate(certificate_id: int, db: Session = Depends(get_db)):
    deleted = crud.certificate.delete(db, certificate_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate details not found",
        )
    return {"detail": "Certificate details deleted successfully"}


@router.put("/{certificate_id}")
async def update_seeker_certificate(
    certificate_id: int,
    certificate: seekerschema.SeekersCertificate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization)
    updated_certificate = crud.certificate.update(
        db, certificate_id, certificate=certificate
    )
    if not updated_certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate details not found",
        )
    return {"details": "Certificate Updated Successfully"}
