import { useState, type PropsWithChildren } from 'react';

import { Formik, Field, Form } from 'formik';
import { Button, Form as BootstrapForm, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export type UsersFiltersProps = PropsWithChildren<{
  onApplyFilters: (disabledFilter?: boolean, searchBarFilter?: string) => void;
  setIsFilterApplied: (isFiltered: boolean) => void;
  isFilterApplied: boolean;
}>;

type FiltersFormValues = {
  searchBarFilter: string;
  disabledFilter?: boolean;
};

export function Filters({ onApplyFilters, setIsFilterApplied, isFilterApplied }: UsersFiltersProps) {
  const { t } = useTranslation('users');
  const [selectedDisabledFilterValue, setSelectedDisabledFilterValue] = useState('all');
  const [searchBarValue, setSearchBarValue] = useState<string>('');
  const [hasFilterToApply, setHasFilterToApply] = useState<boolean>(false);

  const handleSelectDisabledFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDisabledFilterValue(event.target.value);
    setHasFilterToApply(true);
  };

  const handleSearchBar = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchBarValue(event.target.value);
    setHasFilterToApply(true);
  };

  const handleApplyFilters = () => {
    switch (selectedDisabledFilterValue) {
      case 'enabled': {
        if (searchBarValue === '') {
          // Filtre pour Statuts = Actif && rien dans la search bar
          onApplyFilters(false);
        } else {
          // Filtre pour Statuts = Actif && string dans la search bar
          onApplyFilters(false, searchBarValue);
        }
        break;
      }
      case 'disabled': {
        if (searchBarValue === '') {
          // Filtre pour Statuts = Inactif && rien dans la search bar
          onApplyFilters(true);
        } else {
          // Filtre pour Statuts = Inactif && string dans la search bar
          onApplyFilters(true, searchBarValue);
        }
        break;
      }
      case 'all':
        {
          if (searchBarValue === '') {
            // Filtre pour Statuts = All && rien dans la search bar
            onApplyFilters();
          } else {
            // Filtre pour Statuts = All && string dans la search bar
            onApplyFilters(undefined, searchBarValue);
          }
        }
        break;
      default: {
        onApplyFilters();
        break;
      }
    }

    setIsFilterApplied(true);
    setHasFilterToApply(false);
  };

  const handleResetFilters = () => {
    onApplyFilters();
    setSelectedDisabledFilterValue('all');
    setSearchBarValue('');
    setIsFilterApplied(false);
    setHasFilterToApply(false);
  };

  return (
    <div className="filters-form">
      <Formik<FiltersFormValues>
        initialValues={{
          searchBarFilter: '',
          disabledFilter: undefined,
        }}
        onSubmit={handleApplyFilters}>
        <Form>
          <div className="filters-group">
            {/* Search Bar */}
            <BootstrapForm.Group as={Col} controlId="search-bar" onChange={handleSearchBar} className="search-bar">
              <Field
                name="search-bar"
                type="search-bar"
                as={BootstrapForm.Control}
                placeholder={'🔍 ' + `${t('search')}`}
                value={searchBarValue}
              />
            </BootstrapForm.Group>
            {/* Status Filter */}
            <BootstrapForm.Group
              as={Col}
              controlId="disabled-filter"
              className="filter-dropdown"
              onChange={handleSelectDisabledFilterChange}>
              <Field name="disabled-filter" as={BootstrapForm.Select} value={selectedDisabledFilterValue}>
                <option value="all">{t('status.all')}</option>
                <option value="enabled">{t('status.enabled')}</option>
                <option value="disabled">{t('status.disabled')}</option>
              </Field>
            </BootstrapForm.Group>
          </div>
        </Form>
      </Formik>
      <div>
        <Button disabled={!hasFilterToApply} variant="secondary" className="apply-button" onClick={handleApplyFilters}>
          {t('applyFilters')}
        </Button>
        <Button
          hidden={selectedDisabledFilterValue === 'all' && !isFilterApplied && searchBarValue === ''}
          variant="primary"
          onClick={handleResetFilters}>
          {t('resetFilters')}
        </Button>
      </div>
    </div>
  );
}
