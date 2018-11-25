import { h } from 'hyperapp';
import './index.less';

export default (global_state, global_actions) => {
  const actions = global_actions.answers;
  const state = global_state.answers;

  return ({ match }) => (
    <div
      oncreate={() => actions.init({ global_actions })}
      key={match.url}
      id="page-answers"
      class="mdui-container-fluid"
    >

    </div>
  );
};