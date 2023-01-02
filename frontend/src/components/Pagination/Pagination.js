import React from 'react';
import {DOTS, usePagination} from './usePagination';
import MDBox from "../MDBox";
import MDButton from "../MDButton";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange?.length < 2 || paginationRange === undefined) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <MDBox ml={'auto'}>
      <MDButton ml={'auto'} onClick={onPrevious} disabled={currentPage === 1}>
        <ChevronLeftIcon size={'large'} color="secondary"/>
      </MDButton>

      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return  <MDButton _focus={{bg: "gray.200",}}>&#8230;</MDButton>;
        }

        return (
          <MDButton _focus={{bg: "gray.200",}} key={pageNumber} disabled={pageNumber === currentPage}  onClick={() => onPageChange(pageNumber)} >
            {pageNumber}
          </MDButton>
        );
      })}
      <MDButton  disabled={currentPage === lastPage}  onClick={onNext}>
        <ChevronRightIcon  size={'large'} color="secondary"/>
      </MDButton>
    </MDBox>
  );
};

export default Pagination;
