namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AgregarObservacionesConvocatoria : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_Convocatoria", "Observaciones", c => c.String(maxLength: 500));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_Convocatoria", "Observaciones");
        }
    }
}
