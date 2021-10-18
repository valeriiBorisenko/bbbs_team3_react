import { useContext, useEffect, useRef, useState } from 'react';
import profilePageTexts from './locales/RU';
import { ErrorsContext } from '../../contexts';
import { ERROR_MESSAGES } from '../../config/constants';
import {
  useEventBooking,
  useFiltrationAndPagination,
  useProfileDiaries,
  useProfileEvents,
} from '../../hooks';
import { getProfileDiariesData } from '../../api/profile-page';
import {
  AnimatedPageContainer,
  BasePage,
  ButtonRound,
  Heading,
  Loader,
  Paginate,
  PopupDeleteDiary,
  ProfileDiary,
  ProfileEventCard,
  ProfileForm,
  ScrollableContainer,
  UserMenuButton,
} from './index';
import './Profile.scss';

const {
  headTitle,
  headDescription,
  eventsTitle,
  eventsTitleNoResults,
  formTitle,
  eventsArchiveButton,
  eventsCurrentButton,
  eventsTitleArchive,
  eventsTitleNoResultsArchive,
} = profilePageTexts;

const diariesPerPageCount = 10;
const eventsLimit = 10;

function Profile() {
  const { serverError } = useContext(ErrorsContext);
  const [isPageError, setIsPageError] = useState(false);

  // якорь для скролла при работе с дневниками
  const scrollAnchorRef = useRef(null);

  const scrollToForm = () => {
    scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const {
    events,
    archivedEvents,
    setEvents,
    eventsOffset,
    isLoadingEvents,
    isArchiveOpen,
    getArchiveOfEvents,
    getCurrentBookedEvents,
    openEventCard,
    openArchiveOfEvents,
    openCurrentEvents,
  } = useProfileEvents({ eventsLimit });

  const [isDeleteDiaryPopupOpen, setIsDeleteDiaryPopupOpen] = useState(false);
  const closeDeleteDiaryPopup = () => setIsDeleteDiaryPopupOpen(false);

  const {
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
  } = useProfileDiaries({
    closeDeleteDiaryPopup,
    effectOnFormOpen: scrollToForm,
  });

  const openDeleteDiaryPopup = (diary) => {
    setIsDeleteDiaryPopupOpen(true);
    setSelectedDiary(diary);
  };

  const titleH1Current = events.length > 0 ? eventsTitle : eventsTitleNoResults;
  const titleH1Archive =
    archivedEvents.length > 0
      ? eventsTitleArchive
      : eventsTitleNoResultsArchive;

  // пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getProfileDiariesData,
    pageSize: diariesPerPageCount,
    setIsPageError,
  };

  const {
    dataToRender,
    isPageLoading,
    isPaginationUsed,
    totalPages,
    pageIndex,
    changePageIndex,
  } = useFiltrationAndPagination(filtersAndPaginationSettings);

  useEffect(() => {
    setDiaries(dataToRender);
  }, [dataToRender]);

  // отписка от ивентов
  const { selectedEvent } = useEventBooking();

  useEffect(() => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) =>
          event?.id === selectedEvent?.id ? null : event
        )
      );
    }
  }, [selectedEvent]);

  // эффект при переключении страниц пагинации
  useEffect(() => {
    if (scrollAnchorRef && scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView();
    }
    if (isFormOpen) closeForm();
  }, [pageIndex]);

  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <>
      <BasePage headTitle={headTitle} headDescription={headDescription}>
        <section className="profile fade-in">{renderPageContent()}</section>
      </BasePage>
      <PopupDeleteDiary
        isOpen={isDeleteDiaryPopupOpen}
        cardData={selectedDiary}
        onClose={closeDeleteDiaryPopup}
        onCardDelete={handleDeleteDiary}
        isWaitingResponse={isWaitingResponse && isDeleteDiaryPopupOpen}
      />
    </>
  );

  // РЕНДЕРИНГ
  function renderEventCards() {
    const renderingEvents = isArchiveOpen ? archivedEvents : events;
    if (renderingEvents.length > 0) {
      return (
        <>
          {renderingEvents.map((item) => (
            <ProfileEventCard
              key={item?.id}
              data={item}
              onOpen={openEventCard}
              sectionClass="scrollable-container__child slide-in"
            />
          ))}
        </>
      );
    }
    return null;
  }

  function renderAddDiaryButton() {
    if (!isFormOpen && diaries && diaries.length > 0) {
      return (
        <button
          className="profile__button-add-diary fade-in"
          type="button"
          onClick={openForm}
        >
          <ButtonRound color="blue" isSmall isSpan />
        </button>
      );
    }
    return null;
  }

  function renderDiaryForm() {
    if (isFormOpen || (diaries && diaries.length === 0 && !isPageLoading)) {
      return (
        <div className="profile__form-container">
          {!isEditMode && (
            <Heading
              level={2}
              type="small"
              sectionClass="profile__title fade-in"
              content={formTitle}
            />
          )}
          <ProfileForm
            sectionClass="profile__diary-form scale-in"
            isEditMode={isEditMode}
            isOpen={isFormOpen}
            data={formDataToEdit}
            onClose={closeForm}
            onSubmit={handleSubmitDiary}
            isWaitingResponse={isWaitingResponse}
          />
        </div>
      );
    }
    return null;
  }

  function renderDiaries() {
    if (isPaginationUsed) return <Loader isPaginate />;

    if (diaries && diaries.length > 0) {
      return (
        <>
          {diaries.map((diary) => (
            <ProfileDiary
              key={diary?.id}
              data={diary}
              onEdit={handleEditMode}
              onDelete={openDeleteDiaryPopup}
              onShare={handleShareDiary}
              sectionClass="scale-in"
              selectedDiaryId={selectedDiary?.id}
              isWaitingResponse={isWaitingResponse && !isDeleteDiaryPopupOpen}
            />
          ))}
        </>
      );
    }
    return null;
  }

  function renderPageContent() {
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      );
    }
    return (
      <>
        <div className="profile__events-area page__section">
          {!isLoadingEvents ? (
            <>
              <div className="profile__events-heading">
                <UserMenuButton
                  sectionClass="profile__archive-button"
                  title={
                    isArchiveOpen ? eventsCurrentButton : eventsArchiveButton
                  }
                  handleClick={
                    isArchiveOpen ? openCurrentEvents : openArchiveOfEvents
                  }
                />
                <Heading
                  level={2}
                  type="small"
                  sectionClass="profile__title profile__title_shifted"
                  content={isArchiveOpen ? titleH1Archive : titleH1Current}
                />
              </div>
              {(events.length > 0 || archivedEvents.length > 0) && (
                <ScrollableContainer
                  sectionClass="profile__events"
                  step={3}
                  onScrollCallback={() => {
                    if (!serverError) {
                      if (isArchiveOpen) {
                        getArchiveOfEvents({
                          limit: eventsLimit,
                          offset: eventsOffset,
                        });
                      } else {
                        getCurrentBookedEvents({
                          limit: eventsLimit,
                          offset: eventsOffset,
                        });
                      }
                    }
                  }}
                >
                  {renderEventCards()}
                </ScrollableContainer>
              )}
            </>
          ) : (
            <Loader isSmallGrid />
          )}
        </div>

        <div className="profile__diaries page__section">
          <span className="profile__scroll-anchor" ref={scrollAnchorRef} />
          <div className="profile__diaries-container">
            {renderAddDiaryButton()}

            {renderDiaryForm()}

            {renderDiaries()}

            {totalPages > 1 && (
              <Paginate
                sectionClass="cards-section__pagination"
                pageCount={totalPages}
                value={pageIndex}
                onChange={changePageIndex}
                dontUseScrollUp
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
