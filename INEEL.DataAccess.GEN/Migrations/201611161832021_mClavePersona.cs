namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class mClavePersona : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_BitacoraSolicitudesAcceso", "ClavePersona", c => c.String());
            DropColumn("GEN.tab_BitacoraSolicitudesAcceso", "ClavePersonaSolicitante");
        }
        
        public override void Down()
        {
            AddColumn("GEN.tab_BitacoraSolicitudesAcceso", "ClavePersonaSolicitante", c => c.String());
            DropColumn("GEN.tab_BitacoraSolicitudesAcceso", "ClavePersona");
        }
    }
}
