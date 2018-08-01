namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AmpliaLongitudCampoTablaConvocatoria : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.tab_Convocatoria", "Observaciones", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CR.tab_Convocatoria", "Observaciones", c => c.String(maxLength: 500));
        }
    }
}
