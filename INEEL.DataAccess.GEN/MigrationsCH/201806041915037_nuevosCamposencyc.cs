namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nuevosCamposencyc : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_CapacitacionYcertificacion", "objetivo", c => c.String());
            AddColumn("CH.tab_CapacitacionYcertificacion", "tipoAccion", c => c.String(maxLength: 50));
            AddColumn("CH.tab_CapacitacionYcertificacion", "accionCapacitacion", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_CapacitacionYcertificacion", "accionCapacitacion");
            DropColumn("CH.tab_CapacitacionYcertificacion", "tipoAccion");
            DropColumn("CH.tab_CapacitacionYcertificacion", "objetivo");
        }
    }
}
