import { Button } from '@wordpress/components';
import page from '@automattic/calypso-router';
import { useTranslate } from 'i18n-calypso';
import { useSelector } from 'react-redux';
import { getWorkflows } from '../state/workflows/selectors';

import './workflow-list.scss';

export function WorkflowList() {
	const translate = useTranslate();
	const workflows = useSelector( getWorkflows );

	const handleCreateWorkflow = () => {
		page( '/builder' );
	};

	if ( workflows.length === 0 ) {
		return (
			<div className="workflow-list">
				<div className="workflow-list__empty">
				<div className="workflow-list__empty-icon">
					<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M9 7H15"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M9 12H15"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M9 17H12"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<h3 className="workflow-list__empty-title">
					{ translate( 'No workflows yet' ) }
				</h3>
				<p className="workflow-list__empty-description">
					{ translate( 'Get started by creating your first autonomous workflow to automate tasks across your WordPress sites.' ) }
				</p>
				<Button variant="primary" size="default" onClick={ handleCreateWorkflow }>
					{ translate( 'Create Workflow' ) }
				</Button>
			</div>
		</div>
		);
	}

	return (
		<div className="workflow-list">
			<div className="workflow-list__items">
				{ workflows.map( ( workflow ) => (
					<div key={ workflow.id } className="workflow-list__item">
						<div className="workflow-list__item-header">
							<h3 className="workflow-list__item-name">{ workflow.name }</h3>
							<span className={ `workflow-list__item-status workflow-list__item-status--${ workflow.status }` }>
								{ workflow.status }
							</span>
						</div>
						<div className="workflow-list__item-tasks">
							{ translate( '%(count)d task', '%(count)d tasks', {
								count: workflow.tasks.length,
								args: { count: workflow.tasks.length },
							} ) }
						</div>
						<div className="workflow-list__item-stats">
							<span className="workflow-list__item-stat">
								✓ { workflow.stats.successCount } { translate( 'completed' ) }
							</span>
							<span className="workflow-list__item-stat workflow-list__item-stat--error">
								✗ { workflow.stats.failureCount } { translate( 'failed' ) }
							</span>
						</div>
					</div>
				) ) }
			</div>
		</div>
	);
}
