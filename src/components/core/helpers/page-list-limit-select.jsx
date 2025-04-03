import React, { Component } from "react";
import { Input } from "reactstrap";

class PageListLimitSelect extends Component {
  handleChange = (e) => {
    e.preventDefault();
    if (e.target.value) {
      this.props.handlePageLimitChange(parseInt(e.target.value));
    }
  };

  render() {
    const pageLimitOptions = [
      { label: "5 Records / Page", value: 5 },
      { label: "10 Records / Page", value: 10 },
      { label: "20 Records / Page", value: 20 },
      { label: "30 Records / Page", value: 30 },
      { label: "40 Records / Page", value: 40 },
      { label: "50 Records / Page", value: 50 },
      { label: "100 Records / Page", value: 100 },
      { label: "200 Records / Page", value: 200 },
    ];
    return (
      <>
        {this.props.pageLimit ? (
          <div>
            <Input
              type="select"
              name="pageLimit"
              defaultValue={this.props.pageLimit}
              onChange={(e) => {
                this.handleChange(e);
              }}
              style={{
                fontSize: "0.8rem",
              }}
            >
              {pageLimitOptions.map((option, index) => {
                return (
                  <option key={`pl-o-${index}`} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </Input>
          </div>
        ) : null}
      </>
    );
  }
}

export default PageListLimitSelect;
