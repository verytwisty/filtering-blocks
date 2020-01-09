const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { PanelBody, ToggleControl } = wp.components;
const { createHigherOrderComponent } = wp.compose;

// import classnames plugin

import classnames from "classnames";

// import the styles

import "./filters.scss";


// filters the Block Attributes to include new one

addFilter(
  "blocks.registerBlockType",
  "jsforwpadvgb/add-code-attributes",
  modifyAttributes
);

// Filters the edit area to include checkbox / toggle

addFilter(
  "editor.BlockEdit",
  "jsforwpadvgb/add-code-inspector-controls",
  modifyInspectorControls
);

// filters the save element to include new styling

addFilter(
  "blocks.getSaveElement",
  "jsforwpadvgb/modify-code-save-settings",
  modifyCodeSaveSettings
);

// Array of blocks to add the new checkbox to.

function includedBlocksArray(){
    return ["core/code", "core/paragraph"];
}



function modifyAttributes( settings, name ) {

    let modifyTheseBlocks = includedBlocksArray();

    // returns all block settings that are not in the includedBlocksArray early

    if ( ! modifyTheseBlocks.includes( name ) ) return settings;

    // adds a boolean attribute for the toggle

    settings.attributes.lightText = {
        type: "boolean",
        default: false
    };
    
    return settings;
}





function modifyInspectorControls(BlockEdit) {

  const withInspectorControls = createHigherOrderComponent( BlockEdit => {

    let modifyTheseBlocks = includedBlocksArray();   

    return props => {

      if ( ! modifyTheseBlocks.includes( props.name ) ) return <BlockEdit {...props} />;

      return (
        <Fragment>

         <BlockEdit {...props} />
          <InspectorControls>
            <PanelBody title={__("CSS Styles", "jsforwpadvblocks")}>
              <ToggleControl
                label={__("Light Text", "jsforwpadvblocks")}
                checked={props.attributes.lightText}
                onChange={ lightText => props.setAttributes({ lightText }) }
              />
            </PanelBody>
          </InspectorControls>
        </Fragment>
      );
    };
  });
  return withInspectorControls(BlockEdit);
}

function modifyCodeSaveSettings(el, block, attributes) {
  if (! modifyTheseBlocks.includes( block.name ) && attributes.lightText) {
    el.props.className = classnames( el.props.className, {
      "has--light-text": attributes.lightText
    });
  }
  return el;
}