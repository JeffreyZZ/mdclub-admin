import { h } from 'hyperapp';
import $ from 'mdui.jq';

export default ({ label, name, value, helper = false }) => (
  <div class="mdui-textfield" oncreate={(element) => $(element).mutation()}>
    <label class="mdui-textfield-label">{label}</label>
    <textarea class="mdui-textfield-input" name={name} value={value} />
    <If condition={helper}>
      <div class="mdui-textfield-helper">{helper}</div>
    </If>
  </div>
);
