const ContainerStyle = {
  ContainerStyle: {
    position: 'relative',
    width: '100%',
    height: '100%'
  }
}

const GoogleMapStyle = {
  GoogleMapStyle: {
    position: 'relative',
    float: 'left',
    width: '75%',
    height: '770px'
  },

  MapStyle: {
    position: 'relative',
    width: '100%',
    height: '100%'
  }
}

const ToolBoxStyle = {
  ToolBoxStyle: {
    position: 'relative',
    float: 'left',
    width: '25%',
    height: '770px',
    overflow: 'scroll'
  }
}

const ConditionFormStyle = {
  ConditionStyle: {
    paddingTop: "20px",
  },

  RawTextStyle: {
    fontSize: "24px",
    margin: "0 20px"
  },

  TextStyle: {
    width: "50px",
    fontSize: "20px",
  },

  SelectStyle: {
    marginRight: "20px"
  }
}

const MarkerStyle = {
  MarkerStyle: {
    color: "#1F1F1F",
    backgroundColor: "#FFF",
    fontWeight: "200",
    lineHeight: "46px",
    paddingLeft: "20px",
    paddingRight: "10px",
    textAlign: "right"
  },

  StringStyle: {
    float: "left",
    fontSize: "18px"
  },

  GlyphiconStyle: {
    padding: "0 10px",
    visibility: "hidden"
  },

  HoveredMarkerStyle: {
    color: "#1F1F1F",
    backgroundColor: "#E8E8E8",
    fontWeight: "200",
    lineHeight: "46px",
    paddingLeft: "20px",
    paddingRight: "10px",
    textAlign: "right"
  },

  HoveredGlyphiconStyle: {
    padding: "0 10px",
    visibility: "visible"
  },

  PaledGlyphiconStyle: {
    color: "#8B8B8B",
    backgroundColor: "#E8E8E8",
    fontWeight: "200",
    lineHeight: "46px",
    paddingLeft: "20px",
    paddingRight: "10px",
    textAlign: "right"
  },

  InvisibleMarkerStyle: {
    color: "#8B8B8B",
    backgroundColor: "#FFF",
    fontWeight: "200",
    lineHeight: "46px",
    paddingLeft: "20px",
    paddingRight: "10px",
    textAlign: "right"
  }
}

const ModalStyle = {
    HeaderStyle: {
      fontSize: "32px",
      borderBottom: "1px solid #e9e9e9"
    },

    TargetStyle: {
      marginLeft: "10px",
      fontSize: "28px",
      width: "300px",
      display: "inline-block",
    },

    BodyStyle: {
      fontSize: "28px",
      paddingTop: "20px"
    },

    TitleStyle: {
      width: "130px",
      fontSize: "24px"
    },

    OKButtonStyle: {
      width: "90px",
      position: "absolute",
      bottom: "10%",
      right: "17%"
    },

    CancelButtonStyle: {
      position: "absolute",
      bottom: "10%",
      right: "5%"
    }
}

export {
  ContainerStyle,
  ToolBoxStyle,
  ConditionFormStyle,
  MarkerStyle,
  GoogleMapStyle,
  ModalStyle
}
