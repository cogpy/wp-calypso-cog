import { Card, CardBody } from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';
import { WorkflowList } from '../components/workflow-list';
import { WorkflowStats } from '../components/workflow-stats';

import './dashboard.scss';

export function Dashboard() {
	const translate = useTranslate();

	return (
		<div className="orchestration-workbench-dashboard">
			<div className="orchestration-workbench-dashboard__header">
				<h1 className="orchestration-workbench-dashboard__title">
					{ translate( 'Orchestration Workbench' ) }
				</h1>
				<p className="orchestration-workbench-dashboard__description">
					{ translate( 'Create and manage autonomous workflows for your WordPress sites.' ) }
				</p>
			</div>

			<WorkflowStats />

			<Card className="orchestration-workbench-dashboard__workflows">
				<CardBody>
					<div className="orchestration-workbench-dashboard__workflows-header">
						<h2>{ translate( 'Your Workflows' ) }</h2>
					</div>
					<WorkflowList />
				</CardBody>
			</Card>
		</div>
	);
}
