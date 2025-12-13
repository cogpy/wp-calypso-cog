import { Card, CardBody } from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';
import { useSelector } from 'react-redux';
import { getWorkflowStats } from '../state/workflows/selectors';

import './workflow-stats.scss';

export function WorkflowStats() {
	const translate = useTranslate();
	const workflowStats = useSelector( getWorkflowStats );

	const stats = [
		{
			label: translate( 'Active Workflows' ),
			value: workflowStats.activeWorkflows,
			color: 'primary',
		},
		{
			label: translate( 'Completed Tasks' ),
			value: workflowStats.completedTasks,
			color: 'success',
		},
		{
			label: translate( 'Pending Tasks' ),
			value: workflowStats.pendingTasks,
			color: 'warning',
		},
		{
			label: translate( 'Failed Tasks' ),
			value: workflowStats.failedTasks,
			color: 'error',
		},
	];

	return (
		<div className="workflow-stats">
			{ stats.map( ( stat ) => (
				<Card key={ stat.label } className={ `workflow-stats__card workflow-stats__card--${ stat.color }` }>
					<CardBody>
						<div className="workflow-stats__value">{ stat.value }</div>
						<div className="workflow-stats__label">{ stat.label }</div>
					</CardBody>
				</Card>
			) ) }
		</div>
	);
}
