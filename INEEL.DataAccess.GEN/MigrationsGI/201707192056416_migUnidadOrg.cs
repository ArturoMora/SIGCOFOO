namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migUnidadOrg : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GI.cat_PropuestaConIdea", "UnidadOrganizacionalId", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            AlterColumn("GI.cat_PropuestaConIdea", "UnidadOrganizacionalId", c => c.String());
        }
    }
}
