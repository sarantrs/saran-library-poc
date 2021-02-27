import React from "react";
import TextInput from "./loader";
import renderer from "react-test-renderer";
import Loader from "./loader";

describe("TextInput", () => {
  it("renders properly", () => {
    const tree = renderer
      .create(<Loader />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
