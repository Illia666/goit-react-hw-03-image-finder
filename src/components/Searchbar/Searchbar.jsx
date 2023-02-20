import { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './searchBar.module.css';

class SearchBar extends Component {
  state = {
    search: '',
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    const { onChange } = this.props;
    this.setState({ [name]: value });
    onChange();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { onSubmit } = this.props;
    onSubmit({ ...this.state });
  };

  render() {
    return (
      <header className={styles.Searchbar}>
        <form className={styles.SearchForm} onSubmit={this.handleSubmit}>
          <button type="submit" className={styles.SearchButton}>
            <span className={styles.SearchLabel}>Search</span>
          </button>

          <input
            className={styles.SearchInput}
            type="text"
            name="search"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.handleChange}
          />
        </form>
      </header>
    );
  }
}

export default SearchBar;
SearchBar.defaultProps = {
  onChange: {},
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
