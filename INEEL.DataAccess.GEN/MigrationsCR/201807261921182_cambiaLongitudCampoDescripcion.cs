namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambiaLongitudCampoDescripcion : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.tab_Convocatoria", "Descripcion", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CR.tab_Convocatoria", "Descripcion", c => c.String(maxLength: 300));
        }
    }
}
