namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ampliaLongitudCampoConvenio : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.tab_Convenio", "ObjetoConvenio", c => c.String());
            AlterColumn("CR.tab_Convenio", "Observaciones", c => c.String());
            AlterColumn("CR.tab_Convenio", "NoConvenio", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CR.tab_Convenio", "NoConvenio", c => c.String(maxLength: 20));
            AlterColumn("CR.tab_Convenio", "Observaciones", c => c.String(maxLength: 300));
            AlterColumn("CR.tab_Convenio", "ObjetoConvenio", c => c.String(maxLength: 300));
        }
    }
}
