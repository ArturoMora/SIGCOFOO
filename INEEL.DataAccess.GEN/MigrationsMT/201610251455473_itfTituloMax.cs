namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class itfTituloMax : DbMigration
    {
        public override void Up()
        {
            AlterColumn("MT.InformeTecnicoFinal", "Titulo", c => c.String(unicode: false));
        }
        
        public override void Down()
        {
            AlterColumn("MT.InformeTecnicoFinal", "Titulo", c => c.String(maxLength: 300));
        }
    }
}
