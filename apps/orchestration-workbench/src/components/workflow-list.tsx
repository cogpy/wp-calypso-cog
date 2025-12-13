import { Button } from '@wordpress/components';
import page from '@automattic/calypso-router';
import { useTranslate } from 'i18n-calypso';

import './workflow-list.scss';

export function WorkflowList() {
	const translate = useTranslate();

	const handleCreateWorkflow = () => {
		page( '/builder' );
	};

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
