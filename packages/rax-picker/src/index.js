import {Component, createElement} from 'rax';
import {isWeex} from 'universal-env';
import TouchableHighlight from 'rax-touchable';
import Text from 'rax-text';

class Picker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: props.selectedValue
    };
  }

  getPickerData = () => {
    let {
      children,
      selectedValue
    } = this.props;
    let pickerItems = [], items = [], selectIndex = 0;

    if (children.length) {
      pickerItems = children;
    } else {
      pickerItems = [children];
    }

    let pickerStrList = pickerItems.map((item, index) => {
      let {value, label, color} = item.props;
      items.push({
        value: value,
        label: label,
        textColor: color,
      });
      if (value == selectedValue) {
        selectIndex = index;
      }
      return item.props.value;
    });

    return {
      selectIndex: selectIndex,
      pickerStrList: pickerStrList,
      items: items,
    };
  }

  getPickerDataByIndex = (index, pickerData) => {
    let value = '';
    let items = pickerData.items;
    for (let i = 0; i < items.length; i++) {
      if (index == i) {
        value = items[i].value;
      }
    }
    return value;
  }

  handlePress = (webIndex) => {
    const {
      onValueChange,
      selectedValue,
      minimumDate,
      maximumDate,
    } = this.props;

    if (isWeex) {
      const picker = require('@weex-module/picker');
      const pickerData = this.getPickerData();
      picker.pick({
        index: pickerData.selectIndex,
        items: pickerData.pickerStrList,
      }, event => {
        if (event.result === 'success') {
          onValueChange && onValueChange(event.data, pickerData.items);
          this.setState({
            selectedValue: pickerData.items[event.data].value,
          });
        }
      });
    } else {
      const pickerData = this.getPickerData();
      let value = this.getPickerDataByIndex(webIndex, pickerData);
      onValueChange && onValueChange(value, pickerData.items);
    }
  }

  render() {
    let style = {
      ...styles.initial,
      ...this.props.style,
    };
    let textStyle = {
      color: style.color,
      fontSize: style.fontSize,
      fontStyle: style.fontStyle,
      fontWeight: style.fontWeight,
      textAlign: style.textAlign,
      textDecoration: style.textDecoration,
      textOverflow: style.textOverflow,
      lineHeight: style.lineHeight
    };

    if (isWeex) {
      return (
        <TouchableHighlight {...this.props} onPress={this.handlePress} style={style}>
          <Text style={textStyle}>
            {this.state.selectedValue}
          </Text>
        </TouchableHighlight>
      );
    } else {
      const pickerData = this.getPickerData();
      return (
        <select style={style} onChange={(e) => {
          this.handlePress(e.target.options.selectedIndex);
        }}>
          {
            pickerData.items.map((item, index) => {
              if (index == pickerData.selectIndex) {
                return <option selected="selected">{item.value}</option>;
              } else {
                return <option>{item.value}</option>;
              }
            })
          }
        </select>
      );
    }
  }
}

class Item extends Component {
  render() {
    return null;
  }
};

Picker.Item = Item;

const styles = {
  initial: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  }
};

export default Picker;