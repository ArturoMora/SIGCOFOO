namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class aumentocamposcapacitacion : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_CapacitacionYcertificacion", "ClavePersona", c => c.String());
            AddColumn("CH.tab_CapacitacionYcertificacion", "FechaValidacion", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_CapacitacionYcertificacion", "FechaValidacion");
            DropColumn("CH.tab_CapacitacionYcertificacion", "ClavePersona");
        }
    }
}
