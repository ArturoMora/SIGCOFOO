namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevoCampoDescripcionMedio : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "DescripcionMedioContacto", c => c.String(maxLength: 250));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_OportunidadNegocios", "DescripcionMedioContacto");
        }
    }
}
