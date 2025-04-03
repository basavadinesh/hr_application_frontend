import React from "react";
import classnames from "classnames";
import { AppConfigProps } from "../settings/app-config";
import { AppMsgResProps } from "../messages/app-properties";

const PageListHeaderColumn = ({
  columnId,
  columnType,
  columnLabel,
  isSortable,
  columnWidth,
  sortedColumn,
  sortedOrder,
  handleSortChange,
}) => {
  const handleSort = () => {
    if (isSortable) {
      let sortOrder = AppConfigProps.listPage.sortOrder.ascendingValue;
      if (columnId === sortedColumn) {
        if (sortedOrder === AppConfigProps.listPage.sortOrder.ascendingValue) {
          sortOrder = AppConfigProps.listPage.sortOrder.descendingValue;
        } else {
          sortOrder = AppConfigProps.listPage.sortOrder.ascendingValue;
        }
      }
      handleSortChange(columnId, sortOrder, columnType);
    }
  };

  const renderSortArrows = () => {
    if (isSortable) {
      if (columnId === sortedColumn) {
        if (sortedOrder === AppConfigProps.listPage.sortOrder.ascendingValue) {
          return (
            <span className="float-right pr-2 mdi mdi-sort-ascending "></span>
          );
        } else {
          return (
            <span className="float-right pr-2 mdi mdi-sort-descending "></span>
          );
        }
      }
    }
  };

  return (
    <th
      onClick={handleSort}
      className={classnames({
        "col-sort": isSortable === true,
      })}
      title={
        isSortable
          ? columnId === sortedColumn
            ? sortedOrder === AppConfigProps.listPage.sortOrder.ascendingValue
              ? AppMsgResProps.body.content.sortDescending
              : AppMsgResProps.body.content.sortAscending
            : AppMsgResProps.body.content.sortAscending
          : null
      }
      width={columnWidth}
    >
      {columnLabel}
      {renderSortArrows()}
    </th>
  );
};

export default PageListHeaderColumn;
