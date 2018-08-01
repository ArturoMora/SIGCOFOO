namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InstitucionAutorExternoCursoImpartido : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_AutorExternoCursoInterno", "Institucion", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_AutorExternoCursoInterno", "Institucion");
        }
    }
}
