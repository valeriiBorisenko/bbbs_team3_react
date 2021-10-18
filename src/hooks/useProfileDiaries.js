import { useContext, useState } from 'react';
import { DELAY_RENDER, ERROR_CODES, ERROR_MESSAGES } from '../config/constants';
import {
  createDiary,
  deleteDiary,
  editDiary,
  shareDiary,
} from '../api/profile-page';
import { ErrorsContext, PopupsContext } from '../contexts';

const { unauthorized, badRequest } = ERROR_CODES;

const useProfileDiaries = ({
  closeDeleteDiaryPopup,
  effectOnFormOpen = undefined,
}) => {
  const { openPopupError } = useContext(PopupsContext);
  const { setError } = useContext(ErrorsContext);

  const [diaries, setDiaries] = useState([]);
  // удаление дневника
  const [selectedDiary, setSelectedDiary] = useState({});
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formDataToEdit, setFormDataToEdit] = useState(null);

  function openForm(data) {
    if (!data) setIsEditMode(false);
    setIsFormOpen(true);
    if (effectOnFormOpen) {
      effectOnFormOpen();
    }
  }

  function closeForm() {
    setIsFormOpen(false);
    setIsEditMode(false);
    setFormDataToEdit(null);
  }

  function handleEditMode(data) {
    setIsFormOpen(false);
    //! небольшая задержка перед ререндером
    setTimeout(() => {
      setIsEditMode(true);
      setFormDataToEdit(data);
      openForm(data);
    }, DELAY_RENDER);
  }

  function createFormData(data) {
    const formData = new FormData();
    if (data) {
      if (data.id) formData.append('id', data.id);
      if (data.image) formData.append('image', data.image);
      formData.append('date', data.date);
      formData.append('place', data.place);
      formData.append('description', data.description);
      formData.append('mark', data.mark);
    }
    return formData;
  }

  function handleErrorOnFormSubmit(err) {
    if (err?.status === badRequest || err?.status === unauthorized) {
      setError(err?.data);
    } else openPopupError();
  }

  function handleCreateDiary(data) {
    createDiary(createFormData(data))
      .then((newDiary) => {
        setDiaries((prevDiaries) => [newDiary, ...prevDiaries]);
        closeForm();
      })
      .catch((err) => handleErrorOnFormSubmit(err))
      .finally(() => setIsWaitingResponse(false));
  }

  function handleEditDiary(data) {
    editDiary(data?.id, createFormData(data))
      .then((newDiary) => {
        setDiaries((prevDiaries) =>
          prevDiaries.map((diary) =>
            diary?.id === newDiary?.id ? newDiary : diary
          )
        );
        closeForm();
      })
      .catch((err) => handleErrorOnFormSubmit(err))
      .finally(() => setIsWaitingResponse(false));
  }

  function handleSubmitDiary(data) {
    setIsWaitingResponse(true);
    if (isEditMode) handleEditDiary(data);
    else handleCreateDiary(data);
  }

  function handleShareDiary(sharedDiary) {
    setIsWaitingResponse(true);
    setSelectedDiary(sharedDiary);
    shareDiary(sharedDiary?.id)
      .then(() => {
        const newDiary = diaries.find((diary) => diary?.id === sharedDiary?.id);
        newDiary.sentToCurator = true;
        setDiaries((prevDiaries) =>
          prevDiaries.map((diary) =>
            diary?.id === newDiary?.id ? newDiary : diary
          )
        );
      })
      .catch(() => {
        setError(ERROR_MESSAGES.generalErrorMessage);
        openPopupError();
      })
      .finally(() => setIsWaitingResponse(false));
  }

  // УДАЛЕНИЕ ДНЕВНИКА
  function handleDeleteDiary(diary) {
    setIsWaitingResponse(true);
    deleteDiary(diary?.id)
      .then(() => {
        setDiaries((prevDiaries) =>
          prevDiaries.filter((prevDiary) =>
            prevDiary?.id === diary?.id ? null : prevDiary
          )
        );
      })
      .catch(() => {
        setError(ERROR_MESSAGES.generalErrorMessage);
        openPopupError();
      })
      .finally(() => {
        setIsWaitingResponse(false);
        closeDeleteDiaryPopup();
      });
  }

  return {
    diaries,
    setDiaries,
    selectedDiary,
    setSelectedDiary,
    isFormOpen,
    openForm,
    closeForm,
    formDataToEdit,
    isEditMode,
    isWaitingResponse,
    handleDeleteDiary,
    handleShareDiary,
    handleSubmitDiary,
    handleEditMode,
  };
};

export default useProfileDiaries;
