import React, { Component } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import classnames from "classnames";
import { AppMsgResProps } from "../messages/app-properties";

class PageListPagination extends Component {
  handleClick = (pageOffset) => {
    if (pageOffset >= 0) {
      this.props.handlePageOffsetChange(pageOffset);
    }
  };

  render() {
    if (this.props.totalRecords) {
      let pageOffset = this.props.pageOffset;
      const pageLimit = this.props.pageLimit;
      //const recordCount = this.props.recordCount;
      const totalRecords = this.props.totalRecords;
      let pageCount = Math.ceil(totalRecords / pageLimit);

      if (pageOffset < 0 || pageOffset > pageCount - 1) {
        pageOffset = 0;
      }

      const firstItemDisableStatus = pageOffset === 0 ? true : false;
      const firstItemClickCallback = () => this.handleClick(0);

      const lastItemDisableStatus = pageOffset === pageCount - 1 ? true : false;
      const lastItemClickCallback = () => this.handleClick(pageCount - 1);

      const previousItemDisableStatus = pageOffset === 0 ? true : false;
      const previousItemClickCallback = () => this.handleClick(pageOffset - 1);

      const nextItemDisableStatus = pageOffset === pageCount - 1 ? true : false;
      const nextItemClickCallback = () => this.handleClick(pageOffset + 1);

      let pageNumArray = [];
      if (pageCount <= 5) {
        for (let i = 1; i <= pageCount; i++) {
          pageNumArray.push(i);
        }
      } else if (pageCount > 5 && pageCount <= 10) {
        for (let j = 1; j <= 2; j++) {
          pageNumArray.push(j);
        }
        for (let k = pageCount - 1; k <= pageCount; k++) {
          pageNumArray.push(k);
        }
      } else {
        let midNum1 = parseInt(pageCount / 2);
        let midNum2 = parseInt(midNum1 + 1);
        let firstNum = parseInt(midNum1 / 2);
        let lastNum = parseInt(midNum2 + midNum2 / 2);
        pageNumArray.push(firstNum);
        pageNumArray.push(midNum1);
        pageNumArray.push(midNum2);
        pageNumArray.push(lastNum);
      }
      return (
        <Pagination listClassName="justify-content-center" size="md">
          <PaginationItem
            disabled={firstItemDisableStatus}
            title={AppMsgResProps.body.content.firstPage}
          >
            <PaginationLink
              first
              onClick={firstItemClickCallback}
              className={classnames(
                {
                  "page-list-pagination-link-disable":
                    firstItemDisableStatus === true,
                },
                {
                  "page-list-pagination-link-enable":
                    firstItemDisableStatus === false,
                }
              )}
            />
          </PaginationItem>
          <PaginationItem
            disabled={previousItemDisableStatus}
            title={AppMsgResProps.body.content.previousPage}
          >
            <PaginationLink
              previous
              onClick={previousItemClickCallback}
              className={classnames(
                {
                  "page-list-pagination-link-disable":
                    previousItemDisableStatus === true,
                },
                {
                  "page-list-pagination-link-enable":
                    previousItemDisableStatus === false,
                }
              )}
            />
          </PaginationItem>
          {pageNumArray.map((element) => {
            let pageItemEnableStatus =
              element - 1 === pageOffset ? true : false;
            return (
              <PaginationItem
                active={pageItemEnableStatus}
                key={`msrp-${element}`}
                title={`${AppMsgResProps.body.content.page} ${element}`}
              >
                <PaginationLink
                  onClick={() => this.handleClick(element - 1)}
                  className={classnames(
                    {
                      "page-list-pagination-link-active":
                        pageItemEnableStatus === true,
                    },
                    {
                      "page-list-pagination-link-inactive":
                        pageItemEnableStatus === false,
                    }
                  )}
                >
                  {element}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem
            disabled={nextItemDisableStatus}
            title={AppMsgResProps.body.content.nextPage}
          >
            <PaginationLink
              next
              onClick={nextItemClickCallback}
              className={classnames(
                {
                  "page-list-pagination-link-disable":
                    nextItemDisableStatus === true,
                },
                {
                  "page-list-pagination-link-enable":
                    nextItemDisableStatus === false,
                }
              )}
            />
          </PaginationItem>
          <PaginationItem
            disabled={lastItemDisableStatus}
            title={AppMsgResProps.body.content.lastPage}
          >
            <PaginationLink
              last
              onClick={lastItemClickCallback}
              className={classnames(
                {
                  "page-list-pagination-link-disable":
                    lastItemDisableStatus === true,
                },
                {
                  "page-list-pagination-link-enable":
                    lastItemDisableStatus === false,
                }
              )}
            />
          </PaginationItem>
        </Pagination>
      );
    } else {
      return null;
    }
  }
}

export default PageListPagination;
