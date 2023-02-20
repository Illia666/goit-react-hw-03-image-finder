import { Component } from 'react';
import { animateScroll as scroll } from 'react-scroll';

import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ErrorMessage from '../shared/components/ErrorMessage/ErrorMessage';

import Button from '../shared/components/Button/Button';
import Loader from 'shared/components/Loader/Loader';
import Modal from 'components/Modal/Modal';

import { PER_PAGE, searchImages } from '../shared/API/images-api';

import styles from './app.modules.scss';
import '../styles/shared.scss';

export class App extends Component {
  state = {
    search: '11',
    images: [],
    page: 1,
    isLoaded: false,
    totalImages: 0,
    error: '',
    isShowLoadMore: false,
    isModalOpen: false,
    currentImage: null,
  };

  componentDidUpdate(_, prevState) {
    const { search: prevSearch, page: prevPage } = prevState;
    const { search, page } = this.state;

    if (search !== prevSearch || prevPage !== page) {
      this.fetchImages();
    }
  }

  handleSubmit = ({ search }) => {
    this.setState({ search, error: '', images: [], page: 1 });
  };

  handleChangeForm = () => {
    const { error } = this.state;
    if (error.length > 0) {
      this.setState({ error: '' });
    }
  };

  async fetchImages() {
    const { search, page, images } = this.state;
    this.setState({ isLoaded: true, totalImages: 0 });
    try {
      const result = await searchImages(search, page);

      const { totalHits, hits } = result;
      const items = hits.map(({ webformatURL, id, largeImageURL, tags }) => {
        return { url: webformatURL, id, largeUrl: largeImageURL, tags };
      });
      const isShow = this.setIsSowLoadMore(totalHits);

      this.setState({
        images: [...images, ...items],
        totalImages: totalHits,
        isShowLoadMore: isShow,
      });

      scroll.scrollMore(3600);
    } catch (e) {
      this.setState({ error: e.message });
    } finally {
      this.setState({ isLoaded: false });
    }
  }

  setIsSowLoadMore(totalImages) {
    const { page } = this.state;
    const isShow = page * PER_PAGE < totalImages;
    return isShow;
    // this.setState({ isShowLoadMore: isShow });
  }

  loadMore = () => {
    this.setState(({ page }) => {
      return { page: page + 1 };
    });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false, currentImage: null });
  };

  showImage = image => {
    this.setState({ currentImage: image, isModalOpen: true });
  };

  render() {
    const {
      images,
      error,
      isShowLoadMore,
      isLoaded,
      isModalOpen,
      currentImage,
    } = this.state;

    return (
      <div className={styles.App}>
        <SearchBar
          onSubmit={this.handleSubmit}
          onChange={this.handleChangeForm}
        />
        {error.length > 0 && <ErrorMessage message={error} />}
        <ImageGallery images={images} showImage={this.showImage} />
        {isLoaded && <Loader />}
        {isShowLoadMore && (
          <Button caption="Load more" onClick={this.loadMore} />
        )}
        {isModalOpen && (
          <Modal close={this.closeModal} image={currentImage}></Modal>
        )}
        <div id="modal-root"></div>
      </div>
    );
  }
}
