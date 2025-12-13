import { Card, CardBody } from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';

import './workflow-stats.scss';

export function WorkflowStats() {
	const translate = useTranslate();

	const stats = [
		{
			label: translate( 'Active Workflows' ),
			value: 0,
			color: 'primary',
		},
		{
			label: translate( 'Completed Tasks' ),
			value: 0,
			color: 'success',
		},
		{
			label: translate( 'Pending Tasks' ),
			value: 0,
			color: 'warning',
		},
		{
			label: translate( 'Failed Tasks' ),
			value: 0,
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
