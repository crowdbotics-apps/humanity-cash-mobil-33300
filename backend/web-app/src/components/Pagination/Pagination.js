import React from 'react';
import {DOTS, usePagination} from './usePagination';
import MDBox from "../MDBox";
import MDButton from "../MDButton";
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';

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
    <MDBox ml={'auto'} sx={{height: 50}}>
      <MDButton ml={'auto'} onClick={onPrevious} disabled={currentPage === 1}>
        <ArrowLeft sx={{color: '#666666', transform: 'scale(2.5)'}}/>
      </MDButton>

      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <MDButton sx={{color: '#666666'}}>&#8230;</MDButton>;
        }

        if (pageNumber === currentPage) {
          return (
            <MDButton
              sx={{
                backgroundColor: '#8D955D',
                color: '#ffffff',
                minWidth: 40,
                minHeight: 40,
                borderRadius: 20,
                padding: 0,
                fontSize: 12,
                marginLeft: 1,
                marginRight: 1,
              }}
              color={'primary'}
              key={pageNumber + ''}
              onClick={() => null}
            >
              {pageNumber}
            </MDButton>
          );
        } else {
          return (
            <MDButton
              sx={{
                border:'1px #8D955D solid',
                color: '#8D955D',
                minWidth: 40,
                minHeight: 40,
                borderRadius: 20,
                padding: 0,
                fontSize: 12,
                marginLeft: 1,
                marginRight: 1,
              }}
              color={'primary'}
              variant={'outlined'}
              key={pageNumber + ''}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </MDButton>
          );
        }


      })}
      <MDButton disabled={currentPage === lastPage} onClick={onNext}>
        <ArrowRight sx={{color: '#666666', transform: 'scale(2.5)'}}/>
      </MDButton>
    </MDBox>
  );
};

export default Pagination;
